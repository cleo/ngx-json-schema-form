import { SchemaHelperService } from './schema-helper.service';
import { SecuredSchemaValueValidationService } from './secured-schema-value-validation.service';

// @dynamic
export class RequiredSchemaValueValidationService {
  private static readonly VALUE_KEY = 'value';
  private static readonly IS_CONDITIONAL_KEY = 'isConditional';
  private static readonly ONE_OF_KEY = 'oneOf';

  // this method retrieves all the required keys when values are not present, i.e. upon creation or modification of a blueprint.
  public static getRequiredKeysFromSchemaOnly(flattenedSchema: any): string[] {
    return Object.keys(flattenedSchema)
      .filter((key) => key.includes(SchemaHelperService.REQUIRED_KEY))
      .map((key) => {
        // This mapping occurs because the required array is flattened into the format of: "key1.key2.required[0]"
        const parentPath = SchemaHelperService.formatKeyPath(key);
        return `${parentPath}.${flattenedSchema[ key ]}`;
      });
  }

  // TODO: write unit tests for this method
  public static valuesHaveRequiredKeys(schema: any, values: any, includeSecuredFields: boolean): boolean {
    const flattenedSchema = SchemaHelperService.getFlattenedObject(schema);
    const flattenedValues = SchemaHelperService.getFlattenedObject(values);
    const flattenedValueKeys = Object.keys(flattenedValues);
    const includedXOfsAndChildren: IXOfInclusionMaps = {
      oneOf: new Map(),
      allOf: new Map(),
      anyOf: new Map()
    };

    const requiredKeys = RequiredSchemaValueValidationService.getRequiredKeysFromSchemaAndValues(flattenedSchema, flattenedValues, includedXOfsAndChildren, includeSecuredFields);

    // TODO: handle if oneOf (and later anyOf and allOf, when implemented) is not present in values and should be
    // TODO: handle if not all children for allOf are present in values
    if ([ ...includedXOfsAndChildren.oneOf.values() ].some(includedChildren => includedChildren.length > 1)) {
      return false;
    }

    return requiredKeys.every(requiredKey => !!flattenedValueKeys.find(path => path === requiredKey || path.includes(requiredKey)));
  }

  /**
   * Builds and returns the array of required keys from the schema while referencing the values.
   *
   * @remarks
   * This method is called when there is an integration for required keys to be checked against. It is used for both appType and blueprint values.
   * There are three distinct parts:
   * 1) Formatting xOf keys to match the value keys, which enables comparison. xOf keys are special cases
   * where the formats of the schema and the corresponding values are different.
   * 2) Filtering out those keys that we shouldn't include in the final required array
   * 3) Adding the applicable keys to the required array
   * Before adding the applicable keys to the array, this method also takes into account isConditional, and does not add the key if a conditional child is not in the values.
   * In addition, this method keeps track of xOfs that are included in the values by way of maps:
   * - the keys are the paths to each distinct xOf
   * - each value is an array containing that xOf's children that are represented in the values.
   *
   * @param flattenedSchema
   * @param flattenedValues
   * @param includedXOfsAndChildren - the xOfs and their children that are included in the values
   * @param includeSecuredFields
   * @returns IFlattenedXOfKeys - an object containing the blueprint's schema-formatted key and the resulting values-formatted key.
   */
  private static getRequiredKeysFromSchemaAndValues(flattenedSchema: any, flattenedValues: any,
                                                    includedXOfsAndChildren: IXOfInclusionMaps, includeSecuredFields: boolean): string[] {
    const flattenedValueKeys = Object.keys(flattenedValues);
    const requiredKeys = [];
    const securedKeyPaths = SecuredSchemaValueValidationService.getSecuredKeyPaths(flattenedSchema);

    Object.keys(flattenedSchema)
    // convert all of the xOf schema paths to the format used by the values.
    // this mapping returns an IFlattenedXOfKeys object that contains the schema path and the converted, values-formatted path.
      .map(key => {
        let formattedKeyPair: IFlattenedXOfKeys = { schemaFormattedKey: key, valuesFormattedKey: key };
        if (key.includes(RequiredSchemaValueValidationService.ONE_OF_KEY)) { // TODO: || allOf key || anyOf key
          formattedKeyPair = RequiredSchemaValueValidationService.getFormattedKeysAndUpdateIncludedXOfs(key, flattenedSchema, flattenedValueKeys, includedXOfsAndChildren);
        }
        return formattedKeyPair;
      })

      // filter out all keys that shouldn't be included in the required array.
      // this comprises of xOf keys that are not represented in the values;
      // keys that do not have "required" in them; and secured keys, if they are not supposed to be included.
      .filter((formattedKeyPair: IFlattenedXOfKeys) => {
        if (!formattedKeyPair || !formattedKeyPair.schemaFormattedKey.includes(SchemaHelperService.REQUIRED_KEY)) {
          return false;
        }

        // handle secured required fields
        const schemaObjectPath = RequiredSchemaValueValidationService.getParentObjectPath(formattedKeyPair.schemaFormattedKey);
        const requiredField = `${SchemaHelperService.formatKeyPath(schemaObjectPath)}.${flattenedSchema[formattedKeyPair.schemaFormattedKey]}`;
        return securedKeyPaths.includes(requiredField) ? includeSecuredFields : true;
      })

      // handle conditional parents before adding the key to the array.
      // does not add if the parent is conditional and is not selected.
      .forEach((formattedKeyPair: IFlattenedXOfKeys) => {
        const schemaObjectParentPath = RequiredSchemaValueValidationService.getParentObjectPath(formattedKeyPair.schemaFormattedKey);
        const valuesObjectParentPath = RequiredSchemaValueValidationService.getParentObjectPath(formattedKeyPair.valuesFormattedKey);

        // handle conditional parent fields
        const isConditional = !!flattenedSchema[`${schemaObjectParentPath}.${RequiredSchemaValueValidationService.IS_CONDITIONAL_KEY}`];
        const parentIsSelected = !!flattenedValues[SchemaHelperService.formatKeyPath(`${valuesObjectParentPath}.${RequiredSchemaValueValidationService.VALUE_KEY}`)];
        if (!isConditional || (isConditional && parentIsSelected)) {
          const valuesPath = SchemaHelperService.formatKeyPath(formattedKeyPair.valuesFormattedKey);
          const schemaPath = flattenedSchema[formattedKeyPair.schemaFormattedKey];
          requiredKeys.push(`${valuesPath}.${schemaPath}`);
        }
      });

    return requiredKeys;
  }

  /**
   * Converts an array-formatted xOf key from the schema to the object-formatted key generated by the values.
   *
   * @remarks
   * Flattened schema keys for xOf options are different from their corresponding value keys because of different original formats (array vs object).
   * For example, a key path for the flattened blueprint might be uselessCreatures.fish[0].reason.
   * Its corresponding flattened value key would then be uselessCreatures.fish.oceanSunfish.reason
   * To enable comparison between the two when checking to be sure all required keys are present, the blueprint keys must be converted to the value key format.
   * uselessCreatures.fish[0].reason --> uselessCreatures.fish.oceanSunfish.reason
   *
   * @param key - The flattened schema key
   * @param flattenedSchema
   * @param flattenedValueKeys
   * @param includedXOfsAndChildren - the map that contains all of the xOfs that are present in the values and their child options that have values.
   * @returns IFlattenedXOfKeys - an object containing the blueprint's schema-formatted key and the resulting values-formatted key.
   */
  private static getFormattedKeysAndUpdateIncludedXOfs(key: string, flattenedSchema: any, flattenedValueKeys: string[],
                                                       includedXOfsAndChildren: IXOfInclusionMaps): IFlattenedXOfKeys {
    const keySegments = key.split('.');
    const keySegmentsConverted = keySegments.slice();

    let lastXOfSegmentIdx;
    let keyAppearsInValues = false;

    // convert oneOf segments
    keySegments.forEach((segment: string, idx: number) => {
      if (segment.includes(RequiredSchemaValueValidationService.ONE_OF_KEY)) { // TODO: || anyOf key || allOf key
        lastXOfSegmentIdx = RequiredSchemaValueValidationService.getLastIndexOfXOfSegment(keySegments, RequiredSchemaValueValidationService.ONE_OF_KEY);

        // replace "oneOf[x]" segment with the child key
        const optionKey = flattenedSchema[ `${keySegments.slice(0, idx + 1)
          .join('.')}.key` ];
        keySegmentsConverted[ idx ] = optionKey;

        // check to see if the path to that xOf segment appears in the values. Add it to the included xOf map if it does.
        const parentPath = SchemaHelperService.formatKeyPath(keySegmentsConverted.slice(0, idx)
                                                                            .join('.'));
        if (flattenedValueKeys.some(valueKey => valueKey.includes(`${parentPath}.${optionKey}`))) {
          RequiredSchemaValueValidationService.addIncludedXOfToMap(parentPath, optionKey, includedXOfsAndChildren.oneOf); // TODO: pick correct map
          if (idx === lastXOfSegmentIdx) {
            keyAppearsInValues = true;
          }
        }
      }
    });

    if (keyAppearsInValues) {
      return { schemaFormattedKey: key, valuesFormattedKey: keySegmentsConverted.join('.') };
    } else {
      return null; // null indicates key is not applicable
    }
  }

  private static addIncludedXOfToMap(parentPath: string, optionKey: string, optionMap: Map<string, string[]>): void {
    if (!optionMap.has(parentPath)) { // we've come across a new xOf
      optionMap.set(parentPath, [ optionKey ]);
    } else if (optionMap.get(parentPath)
                 .indexOf(optionKey) === -1) { //if the xOf is there but the child is not, add the child
      const oneOfArray = optionMap.get(parentPath);
      oneOfArray.push(optionKey);
      optionMap.set(parentPath, oneOfArray);
    }
  }

  private static getLastIndexOfXOfSegment(schemaFormattedKeySegments: string[], xOfKeyword: string): number {
    // find index of _last_ instance of xOf key to get the most nested xOf
    // https://stackoverflow.com/a/40929530
    // TODO: modify findIndex() to find either the oneOf key, anyOf key, or allOf key
    const index = schemaFormattedKeySegments.slice()
      .reverse()
      .findIndex(keySegment => keySegment.includes(xOfKeyword)); // .includes(), since schema format is an array format, ex. oneOf[0]
    return index >= 0 ? (schemaFormattedKeySegments.length - 1) - index : index;
  }

  private static getParentObjectPath(key: string): string {
    const keySegments = key.split('.');
    keySegments.pop();
    return keySegments.join('.');
  }
}

interface IFlattenedXOfKeys {
  schemaFormattedKey: string;
  valuesFormattedKey: string;
}

interface IXOfInclusionMaps {
  oneOf: Map<string, string[]>;
  allOf: Map<string, string[]>;
  anyOf: Map<string, string[]>;
}

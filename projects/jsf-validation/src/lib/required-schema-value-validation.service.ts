import { SchemaHelperService } from './schema-helper.service';
import { SecuredSchemaValueValidationService } from './secured-schema-value-validation.service';

// @dynamic
export class RequiredSchemaValueValidationService {
  private static readonly VALUE_KEY = 'value';
  private static readonly IS_CONDITIONAL_KEY = 'isConditional';

  // this method retrieves all the required keys when values are not present, i.e. upon creation or modification of a blueprint.
  public static getRequiredKeysFromSchemaOnly(flattenedSchema: any): string[] {
    return Object.keys(flattenedSchema)
      .filter((key) => key.includes(SchemaHelperService.REQUIRED_KEY))
      .map((key) => {
        // This mapping occurs because the required array is flattened into the format of: "key1.key2.required[0]"
        const parentPath = SchemaHelperService.formatKeyPath(key);
        return this.getFullPathFromParentPathAndChild(parentPath, flattenedSchema[key]);
      });
  }

  /**
   * Validates that values have all required keys, as well as the requisite numbers of xOfs.
   *
   * @remarks
   * This method is called to when validating both appType and blueprint values.
   * There are two parts:
   * 1) Checking that the required numbers of xOfs as prescribed by the parameterSchema are present, and
   * 2) Verifying that all required fields as prescribed by the parameterSchema are present in the values.
   * To accomplish #1, a map for each xOf is created to keep track of which xOf options are selected.
   * To accomplish #2, an array of required keys, built from the parameterSchema, is built and then checked against the flattened value keys.
   *
   * @param schema
   * @param values
   * @param includeSecuredFields - whether or not secured-required keys should be included in the Required array, in addition to the non-secured ones
   * @returns boolean - whether or not the parameterValues meet all of the requirements prescribed by the parameterSchema
   */
  public static valuesHaveRequiredKeys(schema: any, values: any, includeSecuredFields: boolean): boolean {
    const flattenedSchema = SchemaHelperService.getFlattenedObject(schema);
    const flattenedValues = SchemaHelperService.getFlattenedObject(values);
    const flattenedValueKeys = Object.keys(flattenedValues);
    const flattenedSchemaKeys = Object.keys(flattenedSchema);

    // xOfsAndChildrenInValues are here to keep track of which XOf parents and child objects are present in the parameterValues.
    // This is to make sure that the correct amount (only one [oneOf], all [allOf], or at least one [someOf]) are selected,
    // since Clarify is not able to handle missing fields.
    const xOfsAndChildrenInSchema: XOfMaps = new XOfMaps();
    const xOfsAndChildrenInValues: XOfMaps = new XOfMaps();

    // note that, in addition to filling the required keys array,
    // this method call also fills the xOfsAndChildrenInValues/Schema maps with parents and children
    const requiredKeys = RequiredSchemaValueValidationService.getRequiredKeysFromSchemaAndValues(
      flattenedSchema,
      flattenedValues,
      includeSecuredFields,
      xOfsAndChildrenInSchema,
      xOfsAndChildrenInValues);

    // Clarify cannot handle missing fields, so throw an error if the expected number of children are not present.
    const childrenMissingForAllOf = RequiredSchemaValueValidationService.areAllOfChildrenMissing(xOfsAndChildrenInSchema, xOfsAndChildrenInValues, flattenedSchemaKeys);
    const doesNotHaveSingleOneOfChild = [...xOfsAndChildrenInValues.oneOf.keys()]
      .some(schemaParentPath => {
        const children = xOfsAndChildrenInValues.oneOf.get(schemaParentPath);
        return children.filter(child => !!child).length !== 1;
      });

    if (doesNotHaveSingleOneOfChild || childrenMissingForAllOf) {
      return false;
    }

    const hasRequiredKeys = requiredKeys.every(requiredKey => !!flattenedValueKeys.find(path => path === requiredKey || path.includes(requiredKey)));
    if (!hasRequiredKeys) {
      return false;
    }

    const doesNotHaveCorrectEnumValue = requiredKeys.some(requiredKey => {
      const enumSchemaKeys = flattenedSchemaKeys.filter(path => SchemaHelperService.formatKeyPath(path).includes(`${requiredKey}.${SchemaHelperService.ENUM_KEY}[`));
      if (!enumSchemaKeys.length) {
        return false;
      }

      const value = flattenedValues[requiredKey];
      const validValues = enumSchemaKeys.map(key => flattenedSchema[key]);
      return !validValues.includes(value);
    });

    return !doesNotHaveCorrectEnumValue;
  }

  /**
   * Builds and returns the array of required keys from the schema while referencing the values and records what xOf children have been selected.
   *
   * @remarks
   * This method is called when there is an integration for required keys to be checked against. It is used for both appType and blueprint values.
   * There are three distinct parts:
   * 1) Formatting xOf keys to match the value keys, which enables comparison. xOf keys are special cases where the formats of the schema and values are different.
   * 2) Filtering out those keys that we shouldn't include in the final required array
   * 3) Adding the applicable keys to the "required" array
   * Before adding the applicable keys to the array, this method also takes into account isConditional, and it does not add the key if a conditional child is not in the values.
   * In addition, this method keeps track of xOfs that are included in the values by way of maps:
   * - the keys are the paths to each distinct xOf parent
   * - each value is an array containing that xOf's children that are represented in the values.
   *
   * @param flattenedSchema
   * @param flattenedValues
   * @param flattenedValueKeys - an array of the value keys
   * @param includeSecuredFields - a boolean indicating whether secured-required fields should ultimately be included in the "required" array, or ignored
   * @param includedXOfsInSchema - the xOfs and their children that are included in the schema. Only the parents are recorded here; the children are filled in later.
   * @param includedXOfsInValues - the xOfs and their children that are included in the values
   * @returns string[] - the final array of required keys that should be used to validate the parameterValues
   */
  private static getRequiredKeysFromSchemaAndValues(
    flattenedSchema: any,
    flattenedValues: any,
    includeSecuredFields: boolean,
    includedXOfsInSchema: XOfMaps,
    includedXOfsInValues: XOfMaps): string[] {
    const flattenedValueKeys = Object.keys(flattenedValues);
    const flattenedSchemaKeys = Object.keys(flattenedSchema);
    const requiredKeys = [];
    const securedKeyPaths = SecuredSchemaValueValidationService.getSecuredKeyPaths(flattenedSchema);

    Object.keys(flattenedSchema)
      // replace the xOf[idx] segments of each schema path with their respective keys, e.g. fish[0] --> firstFish
      // this mapping returns an IFlattenedXOfKeys object that contains both the schema path and the equivalent values-style path.
      // the values-style path has each xOf[idx] segment replaced with that child's key, taken from the schema.
      // note that the values-style path retains keys like "properties" for this portion.
      .map(key => {
        return Object.values(XOfKeys).find(xOfKey => key.includes(xOfKey))
          ? RequiredSchemaValueValidationService.getFormattedKeysAndUpdateIncludedXOfs(key, flattenedSchema, flattenedValueKeys, includedXOfsInSchema, includedXOfsInValues)
          : { schemaFormattedKey: key, valuesFormattedKey: key }; // nothing to replace
      })

      // filter out all keys that shouldn't be included in the "required" array. This comprises of:
      // 1) xOf keys that are not represented in the values
      // 2) keys that do not have "required" in them
      // 3) secured keys, if they are not supposed to be included
      .filter((formattedKeyPair: IFlattenedXOfKeys) => {
        // no formattedKeyPair indicates that it was an xOf key that was not included in the values
        if (!formattedKeyPair || !formattedKeyPair.schemaFormattedKey.includes(SchemaHelperService.REQUIRED_KEY) || !flattenedSchema[formattedKeyPair.schemaFormattedKey].length) {
          return false;
        }

        // handle secured required fields
        const schemaObjectPath = RequiredSchemaValueValidationService.getParentObjectPath(formattedKeyPair.schemaFormattedKey);
        const requiredField = this.getFullPathFromParentPathAndChild(SchemaHelperService.formatKeyPath(schemaObjectPath), flattenedSchema[formattedKeyPair.schemaFormattedKey]);
        return securedKeyPaths.includes(requiredField) ? includeSecuredFields : true;
      })

      // handle conditional parents before adding the key to the array.
      // does not add if the parent is conditional but not selected.
      .forEach((formattedKeyPair: IFlattenedXOfKeys) => {
        const schemaObjectParentPath = RequiredSchemaValueValidationService.getParentObjectPath(formattedKeyPair.schemaFormattedKey);
        const valuesObjectParentPath = RequiredSchemaValueValidationService.getParentObjectPath(formattedKeyPair.valuesFormattedKey);

        // handle conditional parent fields
        const isConditional = !!flattenedSchema[this.getFullPathFromParentPathAndChild(schemaObjectParentPath, RequiredSchemaValueValidationService.IS_CONDITIONAL_KEY)];
        const conditionalParentValuePath = this.getFullPathFromParentPathAndChild(valuesObjectParentPath, RequiredSchemaValueValidationService.VALUE_KEY);
        const parentIsSelected = !!flattenedValues[SchemaHelperService.formatKeyPath(conditionalParentValuePath)]; // value is a boolean
        if (!isConditional || (isConditional && parentIsSelected)) {
          const valuesPath = SchemaHelperService.formatKeyPath(formattedKeyPair.valuesFormattedKey);
          const schemaPath = flattenedSchema[formattedKeyPair.schemaFormattedKey];
          requiredKeys.push(this.getFullPathFromParentPathAndChild(valuesPath, schemaPath));
        }
      });

    this.addAllChildrenToSchemaXOfMapsForIncludedParents(includedXOfsInSchema, flattenedSchemaKeys);
    return requiredKeys;
  }

  /**
   * Converts an array-formatted xOf key from the schema to the object-formatted key generated by the values.
   *
   * @remarks
   * Flattened schema keys for xOf options are different from their corresponding value keys because of different original formats (array vs object).
   * For example, a key path for the flattened blueprint might be uselessCreatures.fish[0].reason.
   * Its corresponding flattened value key would then be uselessCreatures.fish.oceanSunfish.reason.
   * To enable comparison between the two when checking to be sure all required keys are present, the blueprint keys must be converted to the value key format:
   * uselessCreatures.fish[0].reason --> uselessCreatures.fish.oceanSunfish.reason
   *
   * @param key - The flattened schema key
   * @param flattenedSchema
   * @param flattenedValueKeys
   * @param includedXOfsInSchema - the xOfs and their children that are included in the schema. Only the parents are recorded here; the children are filled in later.
   * @param includedXOfsInValues - the map that contains all of the xOfs that are present in the values and their child options that have values.
   * @returns IFlattenedXOfKeys - an object containing the blueprint's schema-formatted key and the resulting values-formatted key.
   */
  private static getFormattedKeysAndUpdateIncludedXOfs(
    key: string,
    flattenedSchema: any,
    flattenedValueKeys: string[],
    includedXOfsInSchema: XOfMaps,
    includedXOfsInValues: XOfMaps): IFlattenedXOfKeys {
    const keySegments = key.split('.');
    const keySegmentsConverted = keySegments.slice();

    let lastGeneralXOfSegmentIdx;
    let keyIsApplicable = false;

    // convert xOf segments
    const xOfKeys = Object.values(XOfKeys);
    keySegments.forEach((segment: string, idx: number) => {
      xOfKeys.forEach(xOfKey => {
        if (segment.includes(xOfKey)) {
          lastGeneralXOfSegmentIdx = xOfKeys.reduce((greatestIdx: number, currentXOfKey: string) => {
            const lastIdx = RequiredSchemaValueValidationService.getLastIndexOfXOfSegment(keySegments, currentXOfKey);
            return lastIdx > greatestIdx ? lastIdx : greatestIdx;
          }, 0);

          // replace (for example) "oneOf[x]" segment with its key
          const optionKey = flattenedSchema[`${keySegments.slice(0, idx + 1).join('.')}.key`];
          keySegmentsConverted[idx] = optionKey;

          // check to see if the path to that xOf segment appears in the values. Add it to the included xOf map if it does.
          const parentPathInValues = SchemaHelperService.formatKeyPath(keySegmentsConverted.slice(0, idx).join('.'));
          const childIsIncluded = flattenedValueKeys.some(valueKey =>
              valueKey.includes(RequiredSchemaValueValidationService.getFullPathFromParentPathAndChild(parentPathInValues, optionKey)));
          const parentIsIncludedWithoutChildren = flattenedValueKeys.some(valueKey => valueKey === parentPathInValues);

          if (childIsIncluded || parentIsIncludedWithoutChildren) {
            const parentPathInSchema = keySegments.slice(0, idx).join('.');
            RequiredSchemaValueValidationService.addIncludedXOfToMap(parentPathInSchema, childIsIncluded ? segment : null, includedXOfsInValues[xOfKey]);

            // keep track of all the parents that are selected in the map that tracks the xOfs in the schema
            // later, we'll loop through the schema once and add all of its xOf children to compare with the values.
            if (!includedXOfsInSchema[xOfKey].has(parentPathInSchema)) {
              includedXOfsInSchema[xOfKey].set(parentPathInSchema, []);
            }
          }

          if (idx === lastGeneralXOfSegmentIdx) { // we want to see if the entire key is present, hence checking the index of the last XOf segment
            keyIsApplicable = childIsIncluded;
          }
        }
      });
    });

    return keyIsApplicable ?
      { schemaFormattedKey: key, valuesFormattedKey: keySegmentsConverted.join('.') }
      : null; // null indicates key does not appear in the values
  }

  /**
   * Adds an included xOf parent and selected children (if any) to the included xOf map.
   *
   * @remarks
   * This method adds a parent to the map if it is not yet present, and then its selected child, if there is one.
   * Note that if a parent is present in the parameterValues without any children, an empty array ([null]) is set as the value for that parent.
   *
   * @param parentPath - set as the map key
   * @param optionKey - stored in the array of children for a particular parent key
   * @param xOfMap - the particular xOf map to store the parent and child in
   */
  private static addIncludedXOfToMap(parentPath: string, optionKey: string, xOfMap: Map<string, string[]>): void {
    if (!xOfMap.has(parentPath)) {
      xOfMap.set(parentPath, optionKey ? [optionKey] : []);
    } else if (xOfMap.get(parentPath).indexOf(optionKey) === -1) {
      const oneOfArray = xOfMap.get(parentPath);
      oneOfArray.push(optionKey);
      xOfMap.set(parentPath, oneOfArray);
    }
  }

  private static getLastIndexOfXOfSegment(schemaFormattedKeySegments: string[], xOfKeyword: string): number {
    // find index of _last_ instance of xOf key to get the most deeply nested xOf
    // https://stackoverflow.com/a/40929530
    // TODO: modify findIndex() to find either the oneOf key, anyOf key, or allOf key
    const index = schemaFormattedKeySegments
      .slice()
      .reverse()
      .findIndex(keySegment => keySegment.includes(xOfKeyword)); // .includes(), since schema format is an array format, ex. oneOf[0], rather than simply oneOf
    return index >= 0 ? (schemaFormattedKeySegments.length - 1) - index : index;
  }

  private static getParentObjectPath(key: string): string {
    const keySegments = key.split('.');
    keySegments.pop();
    return keySegments.join('.');
  }

  private static getFullPathFromParentPathAndChild(parentPath: string, childSegment: string): string {
    return parentPath ? `${parentPath}.${childSegment}` : childSegment;
  }

  private static addAllChildrenToSchemaXOfMapsForIncludedParents(xOfs: XOfMaps, flattenedSchemaKeys: any): void {
    flattenedSchemaKeys.forEach(schemaKey => {
      const keySegments = schemaKey.split('.');
      // The keys we're targeting will be something like "properties.tabs.allOf[0].type".
      // Since we only care about the child (allOf[0]) and its parent path, we discard the last segment completely.
      keySegments.pop();
      const child = keySegments.pop();
      if (child && (child.includes(XOfKeys.ALL_OF_KEY) || child.includes(XOfKeys.ONE_OF_KEY))) { // TODO: handle anyOf
        const map = xOfs[child.split('[')[0]]; // oneOf[30] --> "oneOf" | "30]" --> "oneOf"
        const parentPath = keySegments.join('.');
        if (map.has(parentPath)) {
          const childArray = map.get(parentPath);
          if (!childArray.includes(child)) {
            childArray.push(child);
            map.set(parentPath, childArray);
          }
        }
      }
    });
  }

  /**
   * Validates that for each allOf parent that is included in the values, all of their children are present.
   *
   * @remarks
   * This method discovers if allOf children are missing by:
   * 1) Getting the included allOf parents and their included children
   * 2) Locating each corresponding allOf in the schema and accessing its children
   * 3) Failing if there is a child not present in the values
   *
   * @param xOfsInSchema
   * @param xOfsInValues
   * @param flattenedSchemaKeys
   * @returns boolean - if there are allOf children missing from the parameterValues
   */
  private static areAllOfChildrenMissing(xOfsInSchema: XOfMaps, xOfsInValues: XOfMaps, flattenedSchemaKeys: any): boolean {
    return [...xOfsInValues.allOf.keys()].some(key => {
      const childrenInValues = xOfsInValues.allOf.get(key);
      const childrenInSchema = xOfsInSchema.allOf.get(key);
      return childrenInSchema.some(child => !childrenInValues.includes(child));
    });
  }
}

interface IFlattenedXOfKeys {
  schemaFormattedKey: string;
  valuesFormattedKey: string;
}

class XOfMaps {
  oneOf: Map<string, string[]>;
  allOf: Map<string, string[]>;
  anyOf: Map<string, string[]>;

  constructor() {
    this.oneOf = new Map();
    this.allOf = new Map();
    this.anyOf = new Map();
  }
}

enum XOfKeys {
  ONE_OF_KEY = 'oneOf',
  ALL_OF_KEY = 'allOf'
}

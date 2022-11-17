import { SchemaHelperService, XOfKeys } from './schema-helper.service';

// @dynamic
export class SecuredSchemaValueValidationService {
  private static readonly OBJECT_KEY = 'object';

  public static getSecuredKeyPaths(flattenedSchema: any): string[] {
    return Object.keys(flattenedSchema)
      .filter((keyPath) => keyPath.includes(SchemaHelperService.SECURED_KEY) && flattenedSchema[keyPath])
      .map(item => SchemaHelperService.formatKeyPath(item));
  }

  public static getNonSecuredValues(values: any, schema: any, returnNullForSecuredValues: boolean = false): any {
    if (!values) {
      return {};
    }

    const flattenedSchema = SchemaHelperService.getFlattenedObject(schema);
    const securedKeyArrayPaths = SecuredSchemaValueValidationService.getSecuredKeyPaths(flattenedSchema);
    if (securedKeyArrayPaths.length) {
      return SecuredSchemaValueValidationService.getNonSecuredValuesFromObject(
        securedKeyArrayPaths.map(path => SecuredSchemaValueValidationService.convertXOfKeys(path)), '', values, returnNullForSecuredValues, {});
    } else {
      return values;
    }
  }

  private static convertXOfKeys(key: string): string {
    const keySegments = key.split('.');
    const keySegmentsConverted = keySegments.slice();
    let lastGeneralXOfSegmentIdx;

    // convert xOf segments
    const xOfKeys = Object.values(XOfKeys);
    keySegments.forEach((segment: string, idx: number) => {
      xOfKeys.forEach(xOfKey => {
        if (segment.includes(xOfKey)) {
          lastGeneralXOfSegmentIdx = xOfKeys.reduce((greatestIdx: number, currentXOfKey: string) => {
            const lastIdx = SchemaHelperService.getLastIndexOfXOfSegment(keySegments, currentXOfKey);
            return lastIdx > greatestIdx ? lastIdx : greatestIdx;
          }, 0);

          keySegmentsConverted.splice(idx, 1);
        }
      });
    });

    return keySegmentsConverted.join('.');
  }

  private static getNonSecuredValuesFromObject(securedKeyPaths: string[], parentPath: string, values: any, returnNullForSecuredValues: boolean, result: any): any {
    Object.keys(values)
      .forEach(key => {
        const currentPath = !!parentPath ? `${parentPath}.${key}` : key;
        const child = values[ key ];

        if (!securedKeyPaths.some(keyPath => keyPath === currentPath)) {
          if (Array.isArray(child) || typeof child !== SecuredSchemaValueValidationService.OBJECT_KEY) { // the child is not an object & is a property
            result[ key ] = child;
          } else {
            result[ key ] = SecuredSchemaValueValidationService.getNonSecuredValuesFromObject(securedKeyPaths, currentPath, child, returnNullForSecuredValues, {});
          }
        } else if (returnNullForSecuredValues) {
          if (Array.isArray(child) || typeof child !== SecuredSchemaValueValidationService.OBJECT_KEY) { // the child is not an object & is a property
            result[ key ] = null;
          } else {
            result[ key ] = SecuredSchemaValueValidationService.getNonSecuredValuesFromObject(securedKeyPaths, currentPath, child, returnNullForSecuredValues, {});
          }
        }
      });

    return result;
  }
}

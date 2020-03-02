import { SchemaHelperService } from './schema-helper.service';

// @dynamic
export class SecuredSchemaValueValidationService {
  private static readonly OBJECT_KEY = 'object';

  public static getSecuredKeyPaths(flattenedSchema: any): string[] {
    return Object.keys(flattenedSchema)
      .filter((keyPath) => keyPath.includes(SchemaHelperService.SECURED_KEY) && flattenedSchema[ keyPath ])
      .map(item => SchemaHelperService.formatKeyPath(item));
  }

  public static getNonSecuredValues(values: any, schema: any): any {
    if (!values) {
      return {};
    }

    const flattenedSchema = SchemaHelperService.getFlattenedObject(schema);
    const securedKeyArrayPaths = SecuredSchemaValueValidationService.getSecuredKeyPaths(flattenedSchema);
    if (securedKeyArrayPaths.length) {
      return SecuredSchemaValueValidationService.getNonSecuredValuesFromObject(securedKeyArrayPaths, '', values, {});
    } else {
      return values;
    }
  }

  private static getNonSecuredValuesFromObject(securedKeyPaths: string[], parentPath: string, values: any, result: any): any {
    Object.keys(values)
      .forEach(key => {
        const currentPath = !!parentPath ? `${parentPath}.${key}` : key;
        const child = values[ key ];

        if (!securedKeyPaths.some(keyPath => keyPath === currentPath)) {
          if (typeof child !== SecuredSchemaValueValidationService.OBJECT_KEY) { // the child is not an object & is a property
            result[ key ] = child;
          } else {
            result[ key ] = SecuredSchemaValueValidationService.getNonSecuredValuesFromObject(securedKeyPaths, currentPath, child, {});
          }
        }
      });

    return result;
  }
}

import Ajv, { ErrorObject } from 'ajv';
import { get } from 'lodash';
import { URI_REGEX } from 'projects/jsf/src/lib/validator.service';
import { SchemaHelperService } from './schema-helper.service';

/**
 * Schema validation using Another JSON Validator (AJV)
 * This does not handle fields with the allOf, anyOf, oneOf keywords.
 * A valid default value must be specified for hidden and read-only properties.
 */
export class SchemaValidationService {
  private static properties = 'properties';
  private static missingProperty = 'missingProperty';
  private static nameProperty = 'name';
  private static isHidden = 'isHidden';
  private static isReadOnly = 'isReadOnly';

  /**
   * Validate the JSON data against the schema using AJV
   * @param schema: schema to validate against
   * @param values: values to validate
   */
  public static validate(schema: any, values: any): JSFErrorObject[] {
    const ajv = new Ajv({allErrors: true, useDefaults: true});
    const updatedSchema = SchemaHelperService.removeUnsupportedTypes(schema);
    const valid = ajv.validate(updatedSchema, values);
    if (!valid) {
      return ajv.errors.map(error => SchemaValidationService.toJsfError(ajv, error));
    }

    const uriErrors = this.validateUris(schema, values);
    if (uriErrors) {
      return [uriErrors];
    }

    return null;
  }

  private static toJsfError(ajv: Ajv.Ajv, error: ErrorObject): JSFErrorObject {
    const schemaPath = error.schemaPath.substring(0, error.schemaPath.lastIndexOf(`/${error.keyword}`));
    const schemaObj = ajv.getSchema(schemaPath);

    return {
      errorObject: error,
      errorSchema: schemaObj.schema[SchemaValidationService.properties] ?? schemaObj.schema
    };
  }

  /**
   * Format the errors from AJV to be more user-friendly
   * @param errors: errors to format
   */
  public static prettyPrintErrors(errors: JSFErrorObject[]): string {
    let errorMsg = '';
    if (errors === undefined || errors === null) {
      return errorMsg;
    }

    errors.forEach(error => {
        // Use the name property for the error message rather than the key
        let errorName: string;
        if (error.errorSchema[error.errorObject.params[SchemaValidationService.missingProperty]]) {
          errorName = error.errorSchema[error.errorObject.params[SchemaValidationService.missingProperty]][SchemaValidationService.nameProperty];
        } else {
          errorName = error.errorSchema[SchemaValidationService.nameProperty];
        }

        let message = error.errorObject.message;
        switch (error.errorObject.keyword) {
          case 'required':
            message = 'is required';
            break;
          case 'pattern':
            message = 'is invalid';
            break;
        }

        errorMsg = errorMsg.concat(`${errorName} ${message}.\n`);
      }
    );

    return errorMsg;
  }

  /**
   * Used to apply extra validation to uri format, since ajv.validate doesn't validate uris correctly.
   */
  private static validateUris(schema: any, values: any) {
    const flatSchema = SchemaHelperService.getFlattenedObject(schema);

    for (const originalKey in flatSchema) {
      if (originalKey.endsWith('.format') && flatSchema[originalKey] === 'uri') {
        const key = SchemaHelperService.formatKeyPath(originalKey);
        const uriValue = get(values, key.substring(0, key.lastIndexOf('.')));
        if (!URI_REGEX.test(uriValue)) {
          return {
            errorObject: {
              keyword: 'format',
              dataPath: key.substring(0, key.lastIndexOf('.')),
              schemaPath: originalKey,
              params: {format: 'uri'},
              message : 'should match format "uri"'
            },
            errorSchema: get(schema, originalKey.substring(0, originalKey.lastIndexOf('.')))
          };
        }
      }
    }

    return null;
  }
}

export interface JSFErrorObject {
  errorObject: ErrorObject;
  errorSchema: any;
}

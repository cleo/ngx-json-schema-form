import Ajv, { ErrorObject } from 'ajv';
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
    const ajv = new Ajv({allErrors: true});
    const updatedSchema = SchemaHelperService.removeUnsupportedTypes(schema);
    const valid = ajv.validate(updatedSchema, values);
    if (!valid) {
      return ajv.errors.map(error => SchemaValidationService.toJsfError(ajv, error));
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
}

export interface JSFErrorObject {
  errorObject: ErrorObject;
  errorSchema: any;
}

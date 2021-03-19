import Ajv, { ErrorObject } from 'ajv';
import { isNil } from 'lodash-es';
import { JSFJsonSchema } from '../../../jsf/src/lib/jsf-json-schema';

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
  public static validate(schema: JSFJsonSchema, values: any): JSFErrorObject[] {
    const ajv = new Ajv({allErrors: true});
    const valid = ajv.validate(schema, values);
    if (!valid) {
      return ajv.errors.map(error => SchemaValidationService.toJsfError(ajv, error))
        .filter(error => !error.errorSchema[SchemaValidationService.isHidden])
        .filter(error => !error.errorSchema[SchemaValidationService.isReadOnly]);
    }
    return null;
  }

  private static toJsfError(ajv: Ajv.Ajv, error: ErrorObject): JSFErrorObject {
    const schemaPath = error.schemaPath.substring(0, error.schemaPath.lastIndexOf(`/${error.keyword}`));
    const schemaObj = ajv.getSchema(schemaPath);

    // Set inherited properties
    if (schemaObj.schema[SchemaValidationService.properties]) {
      if (schemaObj.schema[SchemaValidationService.isHidden]) {
        schemaObj.schema[SchemaValidationService.properties][SchemaValidationService.isHidden] = true;
      }
      if (schemaObj.schema[SchemaValidationService.isReadOnly]) {
        schemaObj.schema[SchemaValidationService.properties][SchemaValidationService.isReadOnly] = true;
      }
    }

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
    if (isNil(errors)) {
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

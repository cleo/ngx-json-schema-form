# JSON Schema Form

This project validates [JSON Schema 7](http://json-schema.org) generated from the front end form builder.
This code needs to work in tandem with the front end [JSON Schema Form](https://www.npmjs.com/package/@cleo/ngx-json-schema-form) package.

### Getting Started
Install the library in your project

```
npm install @cleo/ngx-json-schema-form-validation
```

Once the package has been installed, you can use the `RequiredSchemaValueValidationService`, `SecuredSchemaValueValidationService`, or `SchemaValidationService` to validate from the back end that the schema is formatted as you would expect.

_Note: be sure to only pass in a valid JSON schema object. If you don't already have your own schemas, you can use a preconfigured schema `projects/jsf-launcher/src/app/schema.json` to test with._

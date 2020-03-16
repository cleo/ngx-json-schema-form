import { SchemaTranslationService } from './schema-translation.service';

describe('SchemaTranslationService', () => {
  let schema: any;
  let service: SchemaTranslationService;
  beforeEach(() => {
    service = new SchemaTranslationService();
    schema = {
      type: 'object',
      properties: {
      }
    };
  });

  describe('translateToLatest()', () => {
    describe('translateV1toV2()', () => {
      const format = 'email';
      beforeEach(() => {
        schema.properties = {
          stringKey: {
            type: 'string',
            name: 'name',
            validation: format,
            isSecured: false
          }
        };
      });

      it('should translate from version 1 to version 2 when no version is listed', () => {
        const result = service.translateToLatest(schema);
        expect(result.properties.stringKey.format).toEqual(format);
      });

      it('should translate from version 1 to version 2', () => {
        schema.version = '1.2.1';
        const result = service.translateToLatest(schema);
        expect(result.properties.stringKey.format).toEqual(format);
      });

      it('should replace the validation key with the format key', () => {
        const result = service.translateToLatest(schema);
        const keys = Object.keys(result.properties.stringKey);
        expect(keys.includes('validation')).toEqual(false);
        expect(keys.includes('format')).toEqual(true);
        expect(result.properties.stringKey.format).toEqual(format);
      });

      it('should replace the url validation key with a uri key', () => {
        schema.properties.stringKey.validation = service.URL_KEY;
        const result = service.translateToLatest(schema);
        expect(result.properties.stringKey.format).toEqual(service.URI_KEY);
      });

      it('should replace the number type with an integer type', () => {
        schema.properties.stringKey.type = service.NUMBER_KEY;
        const result = service.translateToLatest(schema);
        expect(result.properties.stringKey.type).toEqual(service.INTEGER_KEY);
      });
    });
  });
});

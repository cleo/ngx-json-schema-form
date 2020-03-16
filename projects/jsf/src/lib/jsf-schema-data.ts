import { JSONSchema } from './form-data-item.service';

export class JSFSchemaData {
  constructor(public schema: JSONSchema, public values: object) {}
}

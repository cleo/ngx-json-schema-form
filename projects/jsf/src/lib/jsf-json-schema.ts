export interface JSFJsonSchema {
  schema$?: string;
  version?: string;
  type: string;
  name?: string;
  display?: string;
  tabs?: string[];
  description?: string;
  properties: any;
  required?: string[];
  conditionallyRequired?: string[];
  isConditional?: boolean;
  key?: string;
  helpText?: string;
  tooltip?: string;
  items?: any[];
}

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
  isStrongLabel?: boolean;
  isDisabled?: boolean;
  key?: string;
  helpText?: string;
  tooltip?: string;
  items?: any;
}

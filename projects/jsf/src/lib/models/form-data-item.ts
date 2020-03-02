export class FormDataItem {
  public path: string;
  public disabledOnSubmit = false;

  constructor(public key: string, public label: string, public tooltip: string, public helpText: string,
              public required: boolean, public pathParts: string[], public type: FormDataItemType, public value: any) {
    this.value = value === null || value === undefined ? '' : value;
    this.tooltip = tooltip || '';
    this.helpText = helpText || '';
    this.path = pathParts.join('.');
  }
}

export enum FormDataItemType {
  Enum,
  xOf,
  Boolean,
  String,
  Object,
  Number
}

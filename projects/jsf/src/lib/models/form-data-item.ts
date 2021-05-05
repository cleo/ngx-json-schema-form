export class FormDataItem {
  public path: string;
  public disabledState: ControlDisabledState = { isCurrentlyDisabled: false, isReadOnly: false, isDisabledOnSubmit: false };

  constructor(public key: string,
              public label: string,
              public tooltip: string,
              public helpText: string,
              public required: boolean,
              public pathParts: string[],
              public type: FormDataItemType,
              public value: any,
              isReadOnly: boolean,
              public isHidden: boolean) {
    this.value = value === null || value === undefined ? '' : value;
    this.tooltip = tooltip || '';
    this.helpText = helpText || '';
    this.path = pathParts.join('.');
    this.disabledState.isReadOnly = isReadOnly;
  }
}

export enum FormDataItemType {
  Enum,
  xOf,
  Boolean,
  String,
  SecuredString,
  Object,
  Integer,
  Array
}

export interface ControlDisabledState {
  isCurrentlyDisabled: boolean;
  isDisabledOnSubmit: boolean;
  isReadOnly: boolean;
}

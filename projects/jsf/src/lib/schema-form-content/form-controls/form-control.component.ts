import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { JSFConfig } from '../../jsf-config';
import { EnumDataItem, OptionDisplayType } from '../../models/enum-data-item';
import { FormDataItem, FormDataItemType } from '../../models/form-data-item';
import { StringDataItem } from '../../models/string-data-item';

@Component({
  selector: 'jsf-form-control',
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.scss']
})
export class FormControlComponent {
  @Input() formItem: FormDataItem;
  @Input() formGroup: FormGroup;
  @Input() config: JSFConfig;
  @Input() labelLengthClass: string;

  schemaElementType: any = FormDataItemType;

  isStringInput(): boolean {
    return this.formItem.type === FormDataItemType.String ||
      this.formItem.type === FormDataItemType.Number;
  }

  get isDropdown(): boolean {
    return this.isEnum && (this.formItem as EnumDataItem).display === OptionDisplayType.DROPDOWN;
  }

  get isRadioButton(): boolean {
    return this.isEnum && (this.formItem as EnumDataItem).display === OptionDisplayType.RADIO_BUTTONS;
  }

  private get isEnum(): boolean {
    return this.formItem.type === this.schemaElementType.Enum;
  }

  isSecured(): boolean {
    const item = this.formItem as StringDataItem;
    return item.securedItemData && item.securedItemData.isSecured;
  }
}

import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { JSFConfig } from '../../jsf-config';
import { EnumDataItem, OptionDisplayType } from '../../models/enum-data-item';
import { FormDataItem, FormDataItemType } from '../../models/form-data-item';
import { StringDataItem } from '../../models/string-data-item';
import { ContentBaseComponent } from '../content-base.component';

@Component({
  selector: 'jsf-form-control',
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.scss']
})
export class FormControlComponent extends ContentBaseComponent {
  @Input() formItem: FormDataItem;
  @Input() formGroup: FormGroup;
  @Input() config: JSFConfig;
  @Input() isEdit: boolean;
  @Input() labelLengthClass: string;

  isStringInput(): boolean {
    return this.formItem.type === FormDataItemType.String ||
      this.formItem.type === FormDataItemType.Integer;
  }

  isDropdown(): boolean {
    return this.isEnum() && (this.formItem as EnumDataItem).display === OptionDisplayType.DROPDOWN;
  }

  isRadioButton(): boolean {
    return this.isEnum() && (this.formItem as EnumDataItem).display === OptionDisplayType.RADIO_BUTTONS;
  }

  private isEnum(): boolean {
    return this.formItem.type === FormDataItemType.Enum;
  }

  isSecured(): boolean {
    return this.formItem.type === FormDataItemType.SecuredString;
  }

  isCheckbox(): boolean {
    return this.formItem.type === FormDataItemType.Boolean;
  }

  isTextArea(): boolean {
    const item = this.formItem as StringDataItem;
    return item.display && item.display.startsWith('textarea');
  }

  isArray(): boolean {
    return this.formItem.type === FormDataItemType.Array;
  }

  isTemplate(): boolean {
    return this.formItem.type === FormDataItemType.Template;
  }
}

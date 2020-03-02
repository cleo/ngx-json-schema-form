import { Component } from '@angular/core';
import { EnumDataItem } from '../../../models/enum-data-item';
import { FormControlBase } from '../form-control-base';

@Component({
  selector: 'jsf-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['radio-button.component.scss']
})
export class RadioButtonComponent extends FormControlBase {
  get formItemAsEnumType(): EnumDataItem {
    return this.formItem as EnumDataItem;
  }
}

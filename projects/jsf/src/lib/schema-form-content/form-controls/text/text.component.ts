import { Component } from '@angular/core';
import { FormDataItemType } from '../../../models/form-data-item';
import { StringDataItem, StringValidationType } from '../../../models/string-data-item';
import { FormControlBase } from '../form-control-base';

@Component({
  selector: 'jsf-text',
  templateUrl: './text.component.html',
  styleUrls: ['text.component.scss']
})
export class TextComponent extends FormControlBase {
  getInputType(): StringValidationType {
    return this.formItem.type === FormDataItemType.Number || this.stringDataItem.listOptions.isList
      ? StringValidationType.None
      : this.stringDataItem.validationType;
  }

  get stringDataItem(): StringDataItem {
    return this.formItem as StringDataItem;
  }

  onStringBlur(): void {

    let val = this.formControl.value;
    if (val === undefined || val === '') {
      return;
    }

    if (typeof val === 'string') {
      val = val.trim();
      if (this.formItem.type === FormDataItemType.Number && !isNaN(val)) {
        val = parseInt(val, 10);
      }
    }

    this.formControl.setValue(val);
  }
}

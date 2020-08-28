import { Component } from '@angular/core';
import { FormDataItemType } from '../../../models/form-data-item';
import { StringDataItem, StringFormat, StringLengthOptions } from '../../../models/string-data-item';
import { FormControlBase } from '../form-control-base';

@Component({
  selector: 'jsf-text',
  templateUrl: './text.component.html',
  styleUrls: ['text.component.scss']
})
export class TextComponent extends FormControlBase {
  showCounter = false;

  onFocus(): void {
    this.showCounter = true;
  }

  getInputType(): StringFormat {
    return this.formItem.type === FormDataItemType.Integer || !!this.getStringDataItem().validationSettings.listDelimiter
      ? StringFormat.None
      : this.getStringDataItem().validationSettings.format;
  }

  getStringDataItem(): StringDataItem {
    return this.formItem as StringDataItem;
  }

  getLengthOptions(): StringLengthOptions {
    return this.getStringDataItem().validationSettings.length;
  }

  onStringBlur(): void {
    if (!this.formControl.value && !this.formItem.required) {
      this.showCounter = false;
    }

    let val = this.formControl.value;
    if (val === undefined || val === '') {
      return;
    }

    if (typeof val === 'string') {
      val = val.trim();
      if (this.formItem.type === FormDataItemType.Integer && !isNaN(val)) {
        val = parseInt(val, 10);
      }
    }

    this.formControl.setValue(val);
  }

  getMaxCharacterCountInfo(): string {
    const lengthOps = this.getLengthOptions();
    const currentLength = this.formControl.value.length;
    return `${currentLength}/${lengthOps.maxLength} characters used. `;
  }

  getMinCharacterCountInfo(): string {
    const currentLength = this.formControl.value.length;
    const counter = `${currentLength} characters used.`;
    const minimumString = `Minimum of ${this.getLengthOptions().minLength} required.`;
    return this.hasMaxLength() ? minimumString : `${counter} ${minimumString}`;
  }

  hasMaxLength(): boolean {
    const ops = this.getLengthOptions();
    return !!ops && !isNaN(ops.maxLength);
  }

  hasMinLength(): boolean {
    const ops = this.getLengthOptions();
    return !!ops && !isNaN(ops.minLength);  }

  hasMaxLengthError(): boolean {
    return this.formControl.errors && this.formControl.errors.maxlength;
  }

  hasMinLengthError(): boolean {
    return this.formControl.errors && this.formControl.errors.minlength;
  }
}

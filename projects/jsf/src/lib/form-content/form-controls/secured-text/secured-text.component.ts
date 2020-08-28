import { Component, Input } from '@angular/core';
import { JSFConfig } from '../../../jsf-config';
import { SecuredStringDataItem } from '../../../models/secured-string-data-item';
import { FormControlBase } from '../form-control-base';

@Component({
  selector: 'jsf-secured-text',
  templateUrl: './secured-text.component.html',
  styleUrls: ['./secured-text.component.scss']
})
export class SecuredTextComponent extends FormControlBase {
  @Input() config: JSFConfig;
  private securedFieldCleared = false;
  showSecuredField = false;

  getSecuredInputType(): string {
    return this.showSecuredField ? 'text' : 'password';
  }

  clearOptionalSecuredField(): void {
    this.securedFieldCleared = true;
    this.formControl.reset();
  }

  get securedStringDataItem(): SecuredStringDataItem {
    return this.formItem as SecuredStringDataItem;
  }

  getPlaceholderText(): string {
    if (!this.isEdit) {
      return this.securedStringDataItem.placeholder;
    }

    if (!this.securedFieldCleared && this.isEdit) {
      return '**************';
    }

    return '';
  }

  isOptionalSecuredDataItem(): boolean {
    return this.securedStringDataItem && !this.securedStringDataItem.wasRequired && this.isEdit && !this.securedStringDataItem.disabledState.isReadOnly;
  }

  toggleSecuredFieldView(): void {
    this.showSecuredField = !this.showSecuredField;
  }

  private showTextVisibilityIcon(): boolean {
    return !!this.formControl.value;
  }

  showObscureIcon(): boolean {
    return this.showTextVisibilityIcon() && this.showSecuredField;
  }

  showViewIcon(): boolean {
    return this.showTextVisibilityIcon()  && !this.showSecuredField;
  }

  onBlur(): void {
    const value = this.formControl.value;

    // null indicates the input has been cleared and that a value should be returned.
    this.formItem.disabledState.isDisabledOnSubmit = this.isEdit && (value === undefined || value === '');

    try {
      this.formControl.setValue(JSON.parse(this.formControl.value));
    } catch { }
  }
}

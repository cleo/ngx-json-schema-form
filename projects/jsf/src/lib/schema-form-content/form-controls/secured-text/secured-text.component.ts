import { Component, Input } from '@angular/core';
import { JSFConfig } from '../../../jsf-config';
import { StringDataItem } from '../../../models/string-data-item';
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
    this.formControl.reset(undefined);
  }

  get stringDataItem(): StringDataItem {
    return this.formItem as StringDataItem;
  }

  isSecured(): boolean {
    return this.stringDataItem.securedItemData.isSecured;
  }

  getPlaceholderText(): string {
    if (!this.config.isEdit || !this.stringDataItem.securedItemData.isSecured) {
      return this.stringDataItem.placeholder;
    }

    if (!this.securedFieldCleared && this.config.isEdit) {
      return '**************';
    }

    return '';
  }

  isOptionalSecuredDataItem(): boolean {
    return this.stringDataItem.securedItemData && !this.stringDataItem.securedItemData.wasRequired
      && this.stringDataItem.securedItemData.isSecured && this.config.isEdit;
  }

  toggleSecuredFieldView(): void {
    this.showSecuredField = !this.showSecuredField;
  }

  private showTextVisibilityIcon(): boolean {
    return this.isSecured() && this.formControl.value;
  }

  showObscureIcon(): boolean {
    return this.showTextVisibilityIcon() && this.showSecuredField;
  }

  showViewIcon(): boolean {
    return this.showTextVisibilityIcon()  && !this.showSecuredField;
  }

  onBlur(): void {
    this.formItem.disabledOnSubmit = this.stringDataItem.securedItemData.isSecured && this.config.isEdit && !this.formControl.value;

    try {
      this.formControl.setValue(JSON.parse(this.formControl.value));
    } catch { }
  }
}

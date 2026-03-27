import { Component } from '@angular/core';
import { SecuredStringDataItem } from '../../../models/secured-string-data-item';
import { FormControlBase } from '../form-control-base';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LabelComponent } from '../label/label.component';

@Component({
    selector: 'jsf-secured-text',
    standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      LabelComponent
    ],
    templateUrl: './secured-text.component.html',
    styleUrls: ['./secured-text.component.scss']
})
export class SecuredTextComponent extends FormControlBase {
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
    return this.formItem() as SecuredStringDataItem;
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
    this.formItem().disabledState.isDisabledOnSubmit = this.isEdit() && (value === undefined || value === '');
  }
}

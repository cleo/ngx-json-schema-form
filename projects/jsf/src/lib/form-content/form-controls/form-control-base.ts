import { Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { FormDataItem } from '../../models/form-data-item';
import { StringDataItem } from '../../models/string-data-item';
import { EMAIL_REGEX, URI_REGEX } from '../../validator.service';
import { ContentBaseComponent } from '../content-base.component';

export class FormControlBase extends ContentBaseComponent implements OnInit {
  @Input() formItem: FormDataItem;
  @Input() labelLengthClass: string;

  get formControl(): FormControl {
    return (this.formGroup.controls[this.formItem.key]) as FormControl;
  }

  ngOnInit(): void {
    if (this.isEdit && !this.formControl.valid) {
      this.formControl.markAsTouched();
    }
  }

  get showError(): boolean {
    return !this.formControl.valid && this.formControl.touched && this.formControl.status !== 'DISABLED';
  }

  getErrorMessage(): string {
    const errors = this.formControl.errors;
    const hasRequiredPattern = errors && errors.pattern && errors.pattern.requiredPattern;

    if (errors.required) {
      return 'This field is required.';
    } else if (hasRequiredPattern && errors.pattern.requiredPattern.toString() === EMAIL_REGEX.toString()) {
      return 'Please enter a valid email.';
    } else if (errors.invalidEmails) {
      return `Please enter a list of valid emails separated by \"${(this.formItem as StringDataItem).validationSettings.listDelimiter}\"
      Invalid emails:
      ${errors.invalidEmails.join(', ')}`;
    } else if (hasRequiredPattern && errors.pattern.requiredPattern.toString() === URI_REGEX.toString()) {
      return 'Please enter a valid url.';
    } else if (errors.invalidUris) {
      return `Please enter a list of valid urls separated by \"${(this.formItem as StringDataItem).validationSettings.listDelimiter}\"
      Invalid urls:
      ${errors.invalidUris.join(', ')}`;
    } else if (errors.integer) {
      return 'Please enter a valid number.';
    } else if (errors.min) {
      return 'Please enter a number greater than 0';
    } else if (errors.max) {
      return 'Your number is too large. Please enter a smaller number.';
    } else if (errors.minlength) {
      return `Please enter a value at least ${errors.minlength.requiredLength} characters long.`;
    } else if (errors.maxlength) {
      return `Please enter a value less than ${errors.maxlength.requiredLength + 1} characters long.`;
    }
    return 'This field is invalid.';
  }
}

import { Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { JSFConfig } from '../../jsf-config';
import { FormDataItem } from '../../models/form-data-item';
import { StringDataItem } from '../../models/string-data-item';
import { EMAIL_REGEX, URL_REGEX } from '../../validator.service';

export class FormControlBase implements OnInit {
  @Input() formItem: FormDataItem;
  @Input() formGroup: FormGroup;
  @Input() labelLengthClass: string;
  @Input() config: JSFConfig;

  get formControl(): FormControl {
    return (this.formGroup.controls[this.formItem.key]) as FormControl;
  }

  ngOnInit(): void {
    if (this.config.isEdit && !this.isValid) {
      this.formControl.markAsTouched();
    }
  }

  get isValid(): boolean {
    return this.formControl.valid;
  }

  get isTouched(): boolean {
    return this.formControl.touched;
  }

  getErrorMessage(): string {
    const errors = this.formControl.errors;
    const hasRequiredPattern = errors.pattern && errors.pattern.requiredPattern;

    if (errors.required) {
      return 'This field is required.';
    } else if (hasRequiredPattern && errors.pattern.requiredPattern.toString() === EMAIL_REGEX.toString()) {
      return 'Please enter a valid email.';
    } else if (errors.invalidEmails) {
      return `Please enter a list of valid emails separated by \"${(this.formItem as StringDataItem).listOptions.delimiter}\"
      Invalid emails:
      ${errors.invalidEmails.join(', ')}`;
    } else if (hasRequiredPattern && errors.pattern.requiredPattern.toString() === URL_REGEX.toString()) {
      return 'Please enter a valid url.';
    } else if (errors.invalidUrls) {
      return `Please enter a list of valid urls separated by \"${(this.formItem as StringDataItem).listOptions.delimiter}\"
      Invalid urls:
      ${errors.invalidUrls.join(', ')}`;
    } else if (errors.integer) {
      return 'Please enter a valid number.';
    } else if (errors.min) {
      return 'Please enter a number greater than 0';
    } else if (errors.max) {
      return 'Your number is too large. Please enter a smaller number.';
    }

    return 'This field is invalid.';
  }
}

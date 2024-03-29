import { Directive, Input, OnInit } from '@angular/core';
import { UntypedFormControl, ValidationErrors } from '@angular/forms';

import { FormDataItem } from '../../models/form-data-item';
import { StringDataItem } from '../../models/string-data-item';
import { EMAIL_REGEX, ValidatorService } from '../../validator.service';
import { ContentBaseComponent } from '../content-base.component';

@Directive()
export class FormControlBase extends ContentBaseComponent implements OnInit {
  @Input() formItem: FormDataItem;
  @Input() labelLengthClass: string;
  @Input() templates: any = {};

  get formControl(): UntypedFormControl {
    return (this.formGroup.controls[this.formItem.key]) as UntypedFormControl;
  }

  get showError(): boolean {
    return !this.formControl.valid && this.formControl.touched && this.formControl.status !== 'DISABLED';
  }

  static formatErrorMessage(errors: ValidationErrors, formItem: FormDataItem): string {
    const hasRequiredPattern = errors && errors.pattern && errors.pattern.requiredPattern;

    if (errors.required) {
      return 'This field is required.';
    } else if (hasRequiredPattern && errors.pattern.requiredPattern.toString() === EMAIL_REGEX.toString()) {
      return 'Please enter a valid email.';
    } else if (errors.invalidEmails) {
      return `Please enter a list of valid emails separated by \"${(formItem as StringDataItem).validationSettings.listDelimiter}\"
      Invalid emails:
      ${errors.invalidEmails.join(', ')}`;
    } else if (errors.invalidUri) {
      return 'Please enter a valid url.';
    } else if (hasRequiredPattern) {
      return `Please enter a valid value.`;
    } else if (errors.invalidUris) {
      return `Please enter a list of valid urls separated by \"${(formItem as StringDataItem).validationSettings.listDelimiter}\"
      Invalid urls:
      ${errors.invalidUris.join(', ')}`;
    } else if (errors.integer) {
      return 'Please enter a valid number.';
    } else if (errors.min) {
      return `Please enter a number greater than ${errors.min.min - 1}.`;
    } else if (errors.max) {
      if (errors.max.max === ValidatorService.MAX_NUMBER) {
        return 'Your number is too large. Please enter a smaller number.';
      }
      return `Please enter a number smaller than ${errors.max.max + 1}.`;
    } else if (errors.minlength) {
      return `Please enter a value at least ${errors.minlength.requiredLength} characters long.`;
    } else if (errors.maxlength) {
      return `Please enter a value less than ${errors.maxlength.requiredLength + 1} characters long.`;
    }
    return 'This field is invalid.';
  }

  ngOnInit(): void {
    if (this.isEdit && !this.formControl.valid) {
      this.formControl.markAsTouched();
    }
  }

  getErrorMessage(): string {
    const errors = this.formControl.errors;
    return FormControlBase.formatErrorMessage(errors, this.formItem);
  }
}

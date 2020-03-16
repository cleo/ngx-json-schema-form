import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

import { FormDataItem, FormDataItemType } from './models/form-data-item';
import { StringDataItem, StringFormat } from './models/string-data-item';

// http://stackoverflow.com/a/46181/1447823 chromium's regex for testing for email
export const EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
// https://stackoverflow.com/a/27755
export const URI_REGEX = /^((http[s]?|ftp):\/\/)?\/?([^\/\.]+\.)*?([^\/\.]+\.[^:\/\s\.]{2,3}(\.[^:\/\s\.]{2,3})?)(:\d+)?($|\/)([^#?\s]+)?(.*?)?(#[\w\-]+)?$/;

@Injectable()
export class ValidatorService {
  readonly MAX_NUMBER = 2147483647;
  readonly MIN_NUMBER = 1;

  getValidators(item: FormDataItem): ValidatorFn[] {
    let validators = [];

    if (item.required) {
      validators.push(Validators.required);
    }

    if (item.type === FormDataItemType.Integer) {
      validators.push(this.getIntValidator(), Validators.min(this.MIN_NUMBER), Validators.max(this.MAX_NUMBER));
    } else if (item.type === FormDataItemType.String) {
      validators = validators.concat(this.getStringValidators(item as StringDataItem));
    }
    return validators;
  }

  private getIntValidator(): ValidatorFn {
    return control => {
      return control.value && isNaN(Number(control.value))
        ? { integer: { valid: false } }
        : null;
    };
  }

  private getStringValidators(item: StringDataItem): ValidatorFn[] {
    const validators = [];
    const options = item.validationSettings;
    switch (options.format) {
      case StringFormat.Uri:
        validators.push(item.validationSettings.listDelimiter ? this.getUriListValidator(item.validationSettings.listDelimiter) : Validators.pattern(URI_REGEX));
        break;
      case StringFormat.Email:
        validators.push(item.validationSettings.listDelimiter ? this.getEmailListValidator(item.validationSettings.listDelimiter) : Validators.pattern(EMAIL_REGEX));
        break;
    }

    if (options.length.maxLength) {
      validators.push(Validators.maxLength(options.length.maxLength));
    }

    if (options.length.minLength) {
      validators.push(Validators.minLength(options.length.minLength));
    }

    return validators;
  }

  private getUriListValidator(delimiter: string): ValidatorFn {
    return control => {
      let invalidUris = [];

      if (control.value) {
        invalidUris = this.getInvalidUris(control, delimiter);
      }
      return invalidUris.length
        ? { invalidUris: this.getInvalidUris(control, delimiter) }
        : null;
    };
  }

  private getInvalidUris(control: AbstractControl, delimiter: string): string[] {
    const uris = control.value.split(delimiter);
    return uris.filter(uri => !URI_REGEX.test(uri));
  }

  private getEmailListValidator(delimiter: string): ValidatorFn {
    return (control: AbstractControl) => {
      let invalidEmails = [];

      if (control.value) {
        invalidEmails = this.getInvalidEmails(control, delimiter);
      }

      return invalidEmails.length
        ? { invalidEmails: invalidEmails }
        : null;
    };
  }

  private getInvalidEmails(control: AbstractControl, delimiter: string): string[] {
    const emails = control.value.split(delimiter);
    return emails.filter(email => !EMAIL_REGEX.test(email));
  }
}

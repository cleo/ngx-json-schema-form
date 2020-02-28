import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

import { FormDataItem, FormDataItemType } from './models/form-data-item';
import { StringDataItem, StringValidationType } from './models/string-data-item';

// http://stackoverflow.com/a/46181/1447823 chromium's regex for testing for email
export const EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
// https://stackoverflow.com/a/27755
export const URL_REGEX = /^((http[s]?|ftp):\/\/)?\/?([^\/\.]+\.)*?([^\/\.]+\.[^:\/\s\.]{2,3}(\.[^:\/\s\.]{2,3})?)(:\d+)?($|\/)([^#?\s]+)?(.*?)?(#[\w\-]+)?$/;

@Injectable()
export class ValidatorService {
  readonly MAX_NUMBER = 2147483647;
  readonly MIN_NUMBER = 1;

  getValidators(item: FormDataItem): ValidatorFn[] {
    const validators = [];

    if (item.required) {
      validators.push(Validators.required);
    }

    if (item.type === FormDataItemType.Number) {
      validators.push(this.getIntValidator(), Validators.min(this.MIN_NUMBER), Validators.max(this.MAX_NUMBER));
    } else if (item.type === FormDataItemType.String) {
      validators.push(this.getStringValidator(item as StringDataItem));
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

  private getStringValidator(item: StringDataItem): ValidatorFn | ValidatorFn[] {
    switch (item.validationType) {
      case StringValidationType.Url:
        return item.listOptions.isList ? this.getUrlListValidator(item.listOptions.delimiter) : Validators.pattern(URL_REGEX);
      case StringValidationType.Email:
        return item.listOptions.isList ? this.getEmailListValidator(item.listOptions.delimiter) : Validators.pattern(EMAIL_REGEX);
    }
  }

  private getUrlListValidator(delimiter: string): ValidatorFn {
    return control => {
      let invalidUrls = [];

      if (control.value) {
        invalidUrls = this.getInvalidUrls(control, delimiter);
      }
      return invalidUrls.length
        ? { invalidUrls: this.getInvalidUrls(control, delimiter) }
        : null;
    };
  }

  private getInvalidUrls(control: AbstractControl, delimiter: string): string[] {
    const urls = control.value.split(delimiter);
    return urls.filter(url => !URL_REGEX.test(url));
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
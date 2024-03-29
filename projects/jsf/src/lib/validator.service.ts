import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { isEmpty } from 'lodash';
import { EnumDataItem } from './models/enum-data-item';
import { FormDataItem, FormDataItemType } from './models/form-data-item';
import { IntegerDataItem } from './models/integer-data-item';
import { StringDataItem, StringFormat } from './models/string-data-item';

// http://stackoverflow.com/a/46181/1447823 chromium's regex for testing for email
export const EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
export const URI_VALID_CHARS_REGEX = new RegExp(/^[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]+$/);

//https://mathiasbynens.be/demo/url-regex
export const URI_REGEX = new RegExp(/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/, 'i');

@Injectable()
export class ValidatorService {
  public static readonly MAX_NUMBER = 2147483647;
  public static readonly MIN_NUMBER = 1;

  getValidators(item: FormDataItem): ValidatorFn[] {
    let validators = [];

    if (item.required && item.type !== FormDataItemType.Enum) {
      validators.push(Validators.required);
    }

    // A value must always be selected from Enum
    if (item.type === FormDataItemType.Enum) {
      validators.push(this.getEnumValidator(item as EnumDataItem));
    }

    if (item.type === FormDataItemType.Integer) {
      validators = validators.concat(this.getIntegerValidators(item as IntegerDataItem));
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
        validators.push(item.validationSettings.listDelimiter ? this.getUriListValidator(item.validationSettings.listDelimiter) : this.uriValidator());
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

    if (options.pattern) {
      validators.push(Validators.pattern(options.pattern));
    }

    return validators;
  }

  private uriValidator(): ValidatorFn {
    return control => {
      if (!control.value) {
        return null;
      }

      const result = !this.isUriValid(control.value) ? {invalidUri: {value: control.value}} : null;
      return result;
    };
  }

  private isUriValid(uri: string): boolean {
      if (isEmpty(uri) || !URI_VALID_CHARS_REGEX.test(uri)) {
        return false;
      }

      let isValid = URI_REGEX.test(uri);
      //if invalid, try adding 'https://' (allow scheme to be missing)
      if (!isValid) {
        isValid = URI_REGEX.test(`https://${uri}`);
      }
      return isValid;
  }

  private getIntegerValidators(item: IntegerDataItem): ValidatorFn[] {
    const validators = [];
    const options = item.validationSettings;

    validators.push(this.getIntValidator());

    let minimum = ValidatorService.MIN_NUMBER;
    let maximum = ValidatorService.MAX_NUMBER;

    if (!this.isNil(options.range?.minimum)) {
      minimum = options.range.minimum;
    }

    if (!this.isNil(options.range?.maximum)) {
      maximum = options.range.maximum;
    }

    if (!this.isNil(options.range?.exclusiveMinimum)) {
      minimum = options.range.exclusiveMinimum + 1;
    }

    if (!this.isNil(options.range?.exclusiveMaximum)) {
      maximum = options.range.exclusiveMaximum - 1;
    }

    validators.push(Validators.min(minimum));
    validators.push(Validators.max(maximum));

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
    return uris.filter(uri => !this.isUriValid(uri));
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

  private getEnumValidator(formItem: EnumDataItem): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value === 'null' ? null : control.value;
      return formItem.enumOptions.map(x => x.key).includes(value) ? null : { required: formItem.label };
    };
  }

  // Would be better to use lodash instead, but including here for compatibility with other projects (lodash vs lodash-es)
  private isNil(value: any): boolean {
    return value === null || value === undefined;
  }
}

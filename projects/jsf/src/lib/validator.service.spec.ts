import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import { FormDataItem, FormDataItemType } from './models/form-data-item';
import { IntegerDataItem, IntegerRangeOptions } from './models/integer-data-item';
import { StringDataItem, StringFormat, StringLengthOptions } from './models/string-data-item';
import { ValidatorService } from './validator.service';
import Spy = jasmine.Spy;

describe('ValidatorService', () => {
  const key = 'key';
  const label = 'label';
  const tooltip = 'tooltip';

  let service: ValidatorService;
  let item: FormDataItem;
  let control: FormControl;
  let validatorFn: ValidatorFn;
  beforeEach(() => {
    service = new ValidatorService();
    item = new FormDataItem(key, label, tooltip, '', false,
      ['path'], FormDataItemType.Boolean, undefined, false, false);
    control = new FormControl('');
    validatorFn = null;
  });

  describe('getValidators()', () => {
    it('adds the Required validator', () => {
      item.required = true;
      expect(service.getValidators(item)).toContain(Validators.required);
    });

    describe('integer validators', () => {
      let getIntValidatorSpy: Spy;
      let intItem: IntegerDataItem;

      beforeEach(() => {
        getIntValidatorSpy = spyOn<any>(service, 'getIntValidator');
        item.type = FormDataItemType.Integer;
        intItem = item as IntegerDataItem;
        intItem.validationSettings = { range: {} as IntegerRangeOptions};
        validatorFn = Validators.compose(service.getValidators(intItem));
      });

      it('adds all integer validators', () => {
        const validators = service.getValidators(item);
        expect(getIntValidatorSpy).toHaveBeenCalled();
        expect(validators.length).toBe(3);
      });

      describe('getIntValidator()', () => {
        beforeEach(() => {
          getIntValidatorSpy.and.callThrough();
          validatorFn = Validators.compose(service.getValidators(item));
        });

        it('returns valid if there is no value', () => {
          expect(validatorFn(control)).toBeNull();
        });

        it('returns invalid if there are letters', () => {
          control.setValue('asdf');
          expect(validatorFn(control)).not.toBeNull();
        });

        describe('range validation', () => {
          it('should throw an error if integer value is more than the maximum value', () => {
            const max = 5;
            intItem.validationSettings.range = {maximum: max, exclusiveMaximum: null, exclusiveMinimum: null, minimum: null};
            validatorFn = Validators.compose(service.getValidators(intItem));
            control.setValue('6');

            const validation = validatorFn(control);
            expect(validation.min).toBeUndefined('The minimum value error should not exist');
            expect(validation.max).toBeDefined('The maximum value error should exist');
            expect(validation.max.max).toEqual(max, `The maximum value should be ${max}`);
          });

          it('should not throw an error if integer value is exactly the maximum value', () => {
            const max = 5;
            intItem.validationSettings.range = {maximum: max, exclusiveMaximum: null, exclusiveMinimum: null, minimum: null};
            validatorFn = Validators.compose(service.getValidators(intItem));
            control.setValue('5');

            const validation = validatorFn(control);
            expect(validation).toBeNull('The maximum value should not flag the value');
          });

          it('should throw an error if integer value is equal to the exclusiveMaximum value', () => {
            const max = 5;
            intItem.validationSettings.range = {maximum: null, exclusiveMaximum: max, exclusiveMinimum: null, minimum: null};
            validatorFn = Validators.compose(service.getValidators(intItem));
            control.setValue('5');

            const validation = validatorFn(control);
            expect(validation.min).toBeUndefined('The minimum value error should not exist');
            expect(validation.max).toBeDefined('The maximum value error should exist');
            expect(validation.max.max).toEqual(max - 1, `The maximum value should be ${max - 1}`);
          });

          it('should not throw an error if integer value is lower than the exclusiveMaximum value', () => {
            const max = 5;
            intItem.validationSettings.range = {maximum: max, exclusiveMaximum: null, exclusiveMinimum: null, minimum: null};
            validatorFn = Validators.compose(service.getValidators(intItem));
            control.setValue('4');

            const validation = validatorFn(control);
            expect(validation).toBeNull('The maximum value should not flag the value');
          });

          it('should throw an error if integer value is less than the minimum value', () => {
            const min = 5;
            intItem.validationSettings.range = {maximum: null, exclusiveMaximum: null, exclusiveMinimum: null, minimum: min};
            validatorFn = Validators.compose(service.getValidators(intItem));
            control.setValue('4');

            const validation = validatorFn(control);
            expect(validation.max).toBeUndefined('The maximum value error should not exist');
            expect(validation.min).toBeDefined('The minimum value error should exist');
            expect(validation.min.min).toEqual(min, 'The minimum value should be the value');
          });

          it('should not throw an error if integer value is exactly the minimum value', () => {
            const min = 0;
            intItem.validationSettings.range = {maximum: null, exclusiveMaximum: null, exclusiveMinimum: null, minimum: min};
            validatorFn = Validators.compose(service.getValidators(intItem));
            control.setValue('0');

            const validation = validatorFn(control);
            expect(validation).toBeNull(`The minimum value should not flag ${min}`);
          });

          it('should throw an error if integer value is equal to the exclusiveMinimum value', () => {
            const min = 0;
            intItem.validationSettings.range = {maximum: null, exclusiveMaximum: null, exclusiveMinimum: min, minimum: null};
            validatorFn = Validators.compose(service.getValidators(intItem));
            control.setValue('-1');

            const validation = validatorFn(control);
            expect(validation.max).toBeUndefined('The minimum value error should not exist');
            expect(validation.min).toBeDefined('The minimum value error should exist');
            expect(validation.min.min).toEqual(min + 1, `The minimum value should be ${min + 1}`);
          });

          it('should not throw an error if integer value is higher than the exclusiveMinimum value', () => {
            const min = 5;
            intItem.validationSettings.range = {maximum: null, exclusiveMaximum: null, exclusiveMinimum: null, minimum: min};
            validatorFn = Validators.compose(service.getValidators(intItem));
            control.setValue('6');

            const validation = validatorFn(control);
            expect(validation).toBeNull('The minimum value should not flag the value');
          });
        });
      });
    });

    describe('getStringValidator()', () => {
      let stringItem: StringDataItem;

      beforeEach(() => {
        item.type = FormDataItemType.String;
        stringItem = item as StringDataItem;
        stringItem.validationSettings = { format: StringFormat.None, length: {} as StringLengthOptions, listDelimiter: '', pattern: null };
        validatorFn = Validators.compose(service.getValidators(stringItem));
      });

      describe('length validation', () => {
        const min = 5;
        const max = 10;

        beforeEach(() => {
          stringItem.validationSettings.length = { minLength: min, maxLength: max};
          validatorFn = Validators.compose(service.getValidators(stringItem));
        });

        it('does not flag an empty value', () => {
          control.setValue('');
          expect(validatorFn(control)).toBeNull('Should not flag a value of \'\'');

          control.setValue(null);
          expect(validatorFn(control)).toBeNull('Should not flag a value of null');

          control.setValue(undefined);
          expect(validatorFn(control)).toBeNull('Should not flag a value of undefined');
        });

        it('should throw an error if string length is less than the minimum length', () => {
          control.setValue('123');
          const validation = validatorFn(control);
          expect(validation.minlength).toBeDefined('The minimum length error should exist');
          expect(validation.minlength.requiredLength).toEqual(min, 'The required length should be the minimum length');
          expect(validation.maxlength).toBeUndefined('The maximum length error should not exist');
        });

        it('should not throw an error if string length is equal to the minimum length', () => {
          control.setValue('12345');
          expect(validatorFn(control)).toBeNull();
        });

        it('should throw an error if string length is more than the maximum length', () => {
          control.setValue('12345678901');
          const validation = validatorFn(control);
          expect(validation.minlength).toBeUndefined('The minimum length error should not exist');
          expect(validation.maxlength).toBeDefined('The maximum length error should exist');
          expect(validation.maxlength.requiredLength).toEqual(max, 'The required length should be the maximum length');
        });

        it('should not throw an error if string length is equal to the maximum length', () => {
          control.setValue('1234567890');
          expect(validatorFn(control)).toBeNull();
        });
      });

      describe('URI Validators', () => {
        let getUriListValidatorSpy: Spy;

        beforeEach(() => {
          getUriListValidatorSpy = spyOn<any>(service, 'getUriListValidator');
          stringItem.validationSettings.format = StringFormat.Uri;
        });

        describe('when validating a single uri', () => {
          beforeEach(() => {
            validatorFn = Validators.compose(service.getValidators(stringItem));
          });

          it('returns the URI pattern validator if it is not a uri list', () => {
            const validators = service.getValidators(stringItem);
            expect(validators.length).toBeDefined();
            expect(getUriListValidatorSpy).not.toHaveBeenCalled();
          });

          it('returns valid if there is no value', () => {
            expect(validatorFn(control)).toBeNull();
          });

          it('validates for a single uri', () => {
            control.setValue('https://test.Okta.com/api');
            expect(validatorFn(control)).toBeNull();
          });

          it('front end correctly validates uris against the uri validator', () => {
            const urls: [string, boolean][] = [
              ['test.com', true],
              ['https://test.com', true],
              ['https://test.com:4200', true],
              ['ftp://test.com', true],
              ['test.com?query=testquery', true],
              ['test-hyphen.com', true],
              ['http://test.com', true],
              ['http://test.co', true],
              ['test.com/🤔', false],
              ['test.com/text\u0002.com', false],
              ['http://test.com/text\u0002.com', false],
              ['http://test.com/textu0002.com', true],
              ['http://test.c', false],
              ['test', false],
              ['http://test .com', false],
              ['https//test.com', false],
              ['http://i-comms.truecommerce.net:42000AS2/F30510A3CH', false],
              ['http://i-comms.truecommerce.net:42000/AS2/F30510A3CH', true]
            ];

            for (const testSet of urls) {
              const url = testSet[0];
              const expectedValidity = testSet[1];
              control.setValue(url);
              expect(validatorFn(control) === null).toBe(expectedValidity, `url: ${url} expectedValidity: ${expectedValidity}`);
            }
          });
        });

        describe('for a uri list', () => {
          beforeEach(() => {
            getUriListValidatorSpy.and.callThrough();
            stringItem.validationSettings.listDelimiter = ';';
            validatorFn = Validators.compose(service.getValidators(stringItem));
          });

          it('returns the email list validator if it is a email list', () => {
            const validators = service.getValidators(stringItem);
            expect(validators.length).toBeDefined();
            expect(getUriListValidatorSpy).toHaveBeenCalled();
          });

          it('returns valid if there is no value', () => {
            control.setValue(null);
            validatorFn = Validators.compose(service.getValidators(stringItem));
            expect(validatorFn(control)).toBeNull();
          });

          describe('when validating the list', () => {
            it('returns valid with a single uri', () => {
              control.setValue('https://test.Okta.com/api');
              expect(validatorFn(control)).toBeNull();
            });

            it('returns valid with a correctly delimited uri list', () => {
              control.setValue('test1.com;https://test.Okta.com/api;test3.com');
              expect(validatorFn(control)).toBeNull();
            });

            it('returns invalid with trailing or leading whitespace', () => {
              const u1 = ' test.uri1 ';
              const u2 = ' test.uri2 ';
              control.setValue(`${u1};${u2}`);
              expect(validatorFn(control).invalidUris).toEqual([u1, u2]);
            });

            it('returns invalid with 1 or more invalid uris', () => {
              const invalidUri = 'test';
              control.setValue(`test.uri;${invalidUri}`);
              expect(validatorFn(control).invalidUris).toEqual([invalidUri]);
            });
          });

        });
      });

      describe('Email Validators', () => {
        let getEmailListValidatorSpy: Spy;

        beforeEach(() => {
          getEmailListValidatorSpy = spyOn<any>(service, 'getEmailListValidator');
          stringItem.validationSettings.format = StringFormat.Email;
        });

        describe('when validating a single email', () => {
          beforeEach(() => {
            validatorFn = Validators.compose(service.getValidators(stringItem));
          });

          it('returns the email pattern validator if it is not a email list', () => {
            const validators = service.getValidators(stringItem);
            expect(validators.length).toBeDefined();
            expect(getEmailListValidatorSpy).not.toHaveBeenCalled();
          });

          it('returns valid if there is no value', () => {
            expect(validatorFn(control)).toBeNull();
          });

          it('validates for a single email', () => {
            control.setValue('test@test.com');
            expect(validatorFn(control)).toBeNull();

            control.setValue('test@test.com:test2@test2.com');
            expect(validatorFn(control)).not.toBeNull();
          });
        });

        describe('for an email list', () => {
          beforeEach(() => {
            getEmailListValidatorSpy.and.callThrough();
            stringItem.validationSettings.listDelimiter = ':';
            validatorFn = Validators.compose(service.getValidators(stringItem));
          });

          it('returns the email list validator if it is a email list', () => {
            const validators = service.getValidators(stringItem);
            expect(validators.length).toBeDefined();
            expect(getEmailListValidatorSpy).toHaveBeenCalled();
          });

          it('returns valid if there is no value', () => {
            control.setValue(null);
            validatorFn = Validators.compose(service.getValidators(stringItem));
            expect(validatorFn(control)).toBeNull();
          });

          describe('when validating the list', () => {
            it('returns valid with a single email', () => {
              control.setValue('test2@test2.com');
              expect(validatorFn(control)).toBeNull();
            });

            it('returns valid with a correctly delimited email list', () => {
              control.setValue('test@test.com:test2@test2.com');
              expect(validatorFn(control)).toBeNull();
            });

            it('returns invalid with trailing or leading whitespace', () => {
              const e1 = ' test@test.com ';
              const e2 = ' test2@test2.com ';
              control.setValue(`${e1}:${e2}`);
              expect(validatorFn(control).invalidEmails).toEqual([e1, e2]);
            });

            it('returns invalid with 1 or more invalid emails', () => {
              const invalidEmail = 'asd';
              control.setValue(`test@test.com:${invalidEmail}`);
              expect(validatorFn(control).invalidEmails).toEqual([invalidEmail]);
            });
          });
        });
      });
      describe('pattern', () => {
        const phoneNumberRegex = '^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$';
        beforeEach(() => {
          stringItem.validationSettings.pattern = phoneNumberRegex;
          validatorFn = Validators.compose(service.getValidators(stringItem));
        });

        it('returns valid if there is no value', () => {
          control.setValue(null);

          expect(validatorFn(control)).toBeNull();
        });

        it('returns valid with a value matching the regex pattern', () => {
          control.setValue('(123)456-7890');

          expect(validatorFn(control)).toBeNull();
        });

        it('returns invalid with a value not matching the regex pattern', () => {
          control.setValue('abc');

          const validation = validatorFn(control);

          expect(validation.pattern).toBeDefined('The pattern error should exist');
          expect(validation.pattern.requiredPattern).toEqual(phoneNumberRegex, 'The pattern value should be the regex');
        });
      });
    });
  });
});

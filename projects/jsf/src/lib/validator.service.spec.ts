import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import { FormDataItem, FormDataItemType } from './models/form-data-item';
import { StringDataItem, StringValidationType } from './models/string-data-item';
import { ValidatorService } from './validator.service';
import Spy = jasmine.Spy;

describe('SchemaFormValidatorService', () => {
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
      ['path'], FormDataItemType.Boolean, undefined);
    control = new FormControl('');
    validatorFn = null;
  });

  describe('getValidators()', () => {
    it('adds the Required validator', () => {
      item.required = true;
      expect(service.getValidators(item)).toContain(Validators.required);
    });

    describe('number validators', () => {
      let getIntValidatorSpy: Spy;

      beforeEach(() => {
        getIntValidatorSpy = spyOn<any>(service, 'getIntValidator');
        item.type = FormDataItemType.Number;
      });

      it('adds all number validators', () => {
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
      });
    });

    describe('getStringValidator()', () => {
      let stringItem: StringDataItem;

      beforeEach(() => {
        item.type = FormDataItemType.String;
        stringItem = item as StringDataItem;
        stringItem.validationType = StringValidationType.None;
        stringItem.listOptions = { isList: false, delimiter: ''};
        stringItem.securedItemData = { isSecured: false, wasRequired: false };
      });

      describe('URL Validators', () => {
        let getUrlListValidatorSpy: Spy;

        beforeEach(() => {
          getUrlListValidatorSpy = spyOn<any>(service, 'getUrlListValidator');
          stringItem.validationType = StringValidationType.Url;
        });

        describe('when validating a single url', () => {
          beforeEach(() => {
            validatorFn = Validators.compose(service.getValidators(stringItem));
          });

          it('returns the URL pattern validator if it is not a url list', () => {
            const validators = service.getValidators(stringItem);
            expect(validators.length).toBeDefined();
            expect(getUrlListValidatorSpy).not.toHaveBeenCalled();
          });

          it('returns valid if there is no value', () => {
            expect(validatorFn(control)).toBeNull();
          });

          it('validates for a single url', () => {
            control.setValue('https://test.Okta.com/api');
            expect(validatorFn(control)).toBeNull();
          });
        });

        describe('for a url list', () => {
          beforeEach(() => {
            getUrlListValidatorSpy.and.callThrough();
            stringItem.listOptions.isList = true;
            stringItem.listOptions.delimiter = ';';
            validatorFn = Validators.compose(service.getValidators(stringItem));
          });

          it('returns the email list validator if it is a email list', () => {
            const validators = service.getValidators(stringItem);
            expect(validators.length).toBeDefined();
            expect(getUrlListValidatorSpy).toHaveBeenCalled();
          });

          it('returns valid if there is no value', () => {
            control.setValue(null);
            validatorFn = Validators.compose(service.getValidators(stringItem));
            expect(validatorFn(control)).toBeNull();
          });

          describe('when validating the list', () => {
            it('returns valid with a single url', () => {
              control.setValue('https://test.Okta.com/api');
              expect(validatorFn(control)).toBeNull();
            });

            it('returns valid with a correctly delimited url list', () => {
              control.setValue('test1.com;https://test.Okta.com/api;test3.com');
              expect(validatorFn(control)).toBeNull();
            });

            it('returns invalid with trailing or leading whitespace', () => {
              const u1 = ' test.url1 ';
              const u2 = ' test.url2 ';
              control.setValue(`${u1};${u2}`);
              expect(validatorFn(control).invalidUrls).toEqual([u1, u2]);
            });

            it('returns invalid with 1 or more invalid urls', () => {
              const invalidUrl = 'test';
              control.setValue(`test.url;${invalidUrl}`);
              expect(validatorFn(control).invalidUrls).toEqual([invalidUrl]);
            });
          });

        });
      });

      describe('Email Validators', () => {
        let getEmailListValidatorSpy: Spy;

        beforeEach(() => {
          getEmailListValidatorSpy = spyOn<any>(service, 'getEmailListValidator');
          stringItem.validationType = StringValidationType.Email;
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
            stringItem.listOptions.isList = true;
            stringItem.listOptions.delimiter = ':';
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
    });
  });
});

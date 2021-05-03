import { Validators } from '@angular/forms';
import { SchemaStringOptions } from '../../../../form-data-item.service';
import { FormDataItemType } from '../../../../models/form-data-item';
import { StringDataItem, StringFormat } from '../../../../models/string-data-item';
import { TableModalService } from './table-modal.service';

describe('TableModalService', () => {
  const mockValidationService = jasmine.createSpyObj('ValidatorService', ['getValidators']);
  let service: TableModalService;
  const itemOptions: SchemaStringOptions = {
    format: StringFormat.None,
    display: null,
    placeholder: null,
    listDelimiter: null,
    minLength: null,
    maxLength: null,
    pattern: null
  };
  const item = new StringDataItem('key', 'label', null, null, false, ['path', 'parts'], FormDataItemType.String, null, false, false, null, itemOptions);

  beforeEach(() => {
    service = new TableModalService(mockValidationService);
  });

  describe('getErrorMessage()', () => {
    it('no error message for null item', () => {
      expect(service.getErrorMessage(null, null)).toBeNull();
    });

    it('no error message for undefined item', () => {
      expect(service.getErrorMessage(undefined, null)).toBeNull();
    });

    it('no error message for empty item', () => {
      expect(service.getErrorMessage('', null)).toBeNull();
    });

    it('gets error message for empty required item', () => {
      const validators = [];
      validators.push(Validators.required);
      mockValidationService.getValidators.and.returnValue(validators);

      expect(service.getErrorMessage(item, '')).toBe('This field is required.');
    });

    it('no error message when required item has value', () => {
      const validators = [];
      validators.push(Validators.required);
      mockValidationService.getValidators.and.returnValue(validators);

      expect(service.getErrorMessage(item, 'value')).toBeNull();
    });
  });
});

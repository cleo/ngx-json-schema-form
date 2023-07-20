import { Injectable } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { ValidatorService } from '../../../../validator.service';
import { FormControlBase } from '../../form-control-base';

@Injectable()
export class TableModalService {
  constructor(private validationService: ValidatorService) { }

  getErrorMessage(item: any, value: any): string {
    if (!item) {
      return null;
    }

    // Create a validator for the value and reuse the non-table-modal validations
    const validatorFn = Validators.compose(this.validationService.getValidators(item));
    if (!validatorFn) {
      return null;
    }

    const control = new UntypedFormControl();
    control.setValue(value);

    const errors = validatorFn(control);
    if (!errors) {
      return null;
    }

    return FormControlBase.formatErrorMessage(errors, item);
  }
}

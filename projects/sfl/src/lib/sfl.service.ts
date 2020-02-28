import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { EnumDataItem, OptionDisplayType } from './models/enum-data-item';
import { FormDataItem, FormDataItemType } from './models/form-data-item';
import { ParentDataItem } from './models/parent-data-item';
import { XOfDataItem } from './models/xOf-data-item';
import { ValidatorService } from './validator.service';

@Injectable()
export class SFLService {
  constructor(private validatorService: ValidatorService) {}

  getForm(form: FormGroup, itemsToAdd: FormDataItem[]): FormGroup {
    return this.fillForm(form, itemsToAdd);
  }

  private fillForm(groupToAddTo: FormGroup, itemsToAdd: FormDataItem[]): FormGroup {
    itemsToAdd.forEach(item => {
      if (item.type === FormDataItemType.Object || item.type === FormDataItemType.xOf) {
        groupToAddTo.addControl(item.key, new FormGroup({}));
        groupToAddTo.controls[item.key] = this.fillForm((groupToAddTo.controls[item.key] as FormGroup), (item as ParentDataItem).items);
      } else {
        groupToAddTo.addControl(item.key, this.createControl(item));
      }
    });
    return groupToAddTo;
  }

  private createControl(item: FormDataItem): FormControl {
    return new FormControl(item.value, Validators.compose(this.validatorService.getValidators(item)));
  }

  /**
   * https://stackoverflow.com/a/49743369/9604069
   * Deep clones the given AbstractControl, preserving values, validators, async validators, and disabled status.
   * @param control AbstractControl
   * @returns AbstractControl
   */

  cloneAbstractControl<T extends AbstractControl>(control: T, isEmptyClone: boolean): T {
    let newControl: T;

    if (control instanceof FormGroup) {
      const formGroup = isEmptyClone ? new FormGroup({}, [], []) :
        new FormGroup({}, control.validator, control.asyncValidator);
      const controls = control.controls;

      Object.keys(controls).forEach(key => {
        formGroup.addControl(key, this.cloneAbstractControl(controls[key], isEmptyClone));
      });

      newControl = formGroup as any;
    } else if (control instanceof FormArray) {
      const formArray = isEmptyClone ? new FormArray([], [], []) :
        new FormArray([], control.validator, control.asyncValidator);

      control.controls.forEach(formControl => formArray.push(this.cloneAbstractControl(formControl, isEmptyClone)));

      newControl = formArray as any;
    } else if (control instanceof FormControl) {
      newControl = isEmptyClone ? new FormControl() as any :
        new FormControl(control.value, control.validator, control.asyncValidator) as any;
    } else {
      throw new Error('Error: unexpected control value');
    }

    if (control.disabled) {
      newControl.disable({emitEvent: false});
    }

    return newControl;
  }

  cloneFormGroupChildControls(formData: FormDataItem[], formGroup: FormGroup, isEmptyClone: boolean): {[key: string]: AbstractControl} {
    const result: {[key: string]: AbstractControl} = {};
    formData.forEach(childItem => {
      const childFormControl: AbstractControl = formGroup.controls[childItem.key] as AbstractControl;
      result[childItem.key] = this.cloneAbstractControl(childFormControl, isEmptyClone);
    });
    return result;
  }
}

export function getLongestFieldLabelClass(items: FormDataItem[]): string {
  const longestLabel = items
    .filter(item => {
      const isApplicableField =
        item.type === FormDataItemType.Number ||
        item.type === FormDataItemType.String ||
        (item.type === FormDataItemType.Enum && (item as EnumDataItem).display === OptionDisplayType.DROPDOWN) ||
        (item.type === FormDataItemType.xOf && (item as XOfDataItem).display === OptionDisplayType.DROPDOWN);

      return isApplicableField && Boolean(item.label);
    })
    .map(item => item.label)
    .reduce((longest, currLabel) => currLabel.length > longest.length ? currLabel : longest, '');

  if (longestLabel.length < 8) {
    return 'label-xs';
  } else if (longestLabel.length < 13) {
    return 'label-s';
  } else if (longestLabel.length < 20) {
    return 'label-m';
  } else if (longestLabel.length < 25) {
    return 'label-lg';
  } else {
    return 'label-xl';
  }
}

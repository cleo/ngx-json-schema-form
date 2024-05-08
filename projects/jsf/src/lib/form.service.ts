import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { EnumDataItem, OptionDisplayType } from './models/enum-data-item';
import { FormDataItem, FormDataItemType } from './models/form-data-item';
import { ParentDataItem } from './models/parent-data-item';
import { XOfDataItem } from './models/xOf-data-item';
import { ValidatorService } from './validator.service';

@Injectable()
export class FormService {
  constructor(private validatorService: ValidatorService) {}

  getForm(form: UntypedFormGroup, itemsToAdd: FormDataItem[]): UntypedFormGroup {
    return this.fillForm(form, itemsToAdd);
  }

  private fillForm(groupToAddTo: UntypedFormGroup, itemsToAdd: FormDataItem[]): UntypedFormGroup {
    itemsToAdd.forEach(item => {
      if (item.type === FormDataItemType.Object || item.type === FormDataItemType.xOf) {
        const formGroup = this.fillForm(new UntypedFormGroup({}), (item as ParentDataItem).items);
        groupToAddTo.addControl(item.key, formGroup);
      } else {
        groupToAddTo.addControl(item.key, this.createControl(item));
      }
    });
    return groupToAddTo;
  }

  private createControl(item: FormDataItem): UntypedFormControl {
    const control =  new UntypedFormControl(item.value, Validators.compose(this.validatorService.getValidators(item)));
    if (item.disabledState.isReadOnly) {
      control.disable();
    }
    return control;
  }

  /*
   * This method finds an Abstract control  using an array of path segments
   * that point to the target AbstractControl. This method will return null if no AbstractControl is found.
   *
   * @param {string[]}  targetPathSegments - an array of path segments that point to the target AbstractControl
   * @param {FormGroup} formGroup - an Angular FormGroup with nested controls (FormControl or FormGroup)
   * @returns {AbstractControl} - the target AbstractControl or null if it is not found.
   */
  findAbstractControl(targetPathSegments: string[], formGroup: UntypedFormGroup): AbstractControl {
    if (!targetPathSegments.length) {
      return null;
    }

    const control = formGroup.controls[targetPathSegments[0]];
    if (!control) {
      return null;
    }

    if (targetPathSegments.length === 1) {
      return control as AbstractControl;
    } else if (control instanceof UntypedFormGroup) {
      return this.findAbstractControl(targetPathSegments.slice(1), control as UntypedFormGroup);
    } else {
      return null;
    }
  }

  /**
   * This method is used to toggle conditionally displayed children.
   * When a control is marked as not visible, it hides it from the page and disables
   * the control so that the value is not returned when the form is submitted.
   *
   * When a control is marked as visible, it is displayed on the page and  the
   * control is enabled so that the value is returned when  the form is submitted.
   *
   * The form control will not be toggled as enabled/disabled if it is marked as read only.
   *
   * @param {FormDataItem} formDataItem: the data item that is toggled
   * @param {AbstractControl} control: the form control that is enabled/disabled
   * @param {boolean} isVisible: whether or not the form should be toggled as visible or hidden
   */
  setVisibilityForConditionalChild(formDataItem: FormDataItem, control: AbstractControl, isVisible: boolean): void {
    formDataItem.isHidden = !isVisible || formDataItem.disabledState.isHidden;
    formDataItem.disabledState.isCurrentlyDisabled = !isVisible || formDataItem.disabledState.isReadOnly;
    if (formDataItem.disabledState.isCurrentlyDisabled) {
      control.disable();
    } else {
      control.enable();
    }

    if (formDataItem instanceof ParentDataItem) {
      (formDataItem as ParentDataItem).items.forEach(child => {
        this.setVisibilityForConditionalChild(child, (control as FormGroup).controls[child.key], isVisible);
      });
    }
  }

  setVisibilityForAllConditionalChildren(parentDataItem: ParentDataItem, formGroup: UntypedFormGroup, isVisible: boolean): void {
    parentDataItem.items.forEach(item => {
        const control = formGroup.controls[item.key];
        this.setVisibilityForConditionalChild(item, control, isVisible);
    });
  }

  /**
   * Will find the child AbstractControls with keys that match the childKeys array and make them visible.
   * All other items will be set hidden.
   * @param {ParentDataItem} parentDataItem
   * @param {FormGroup} formGroup
   * @param {string[]} childKeys - an array of keys that correspond to child AbstractControls that should be visible
   */
  showNecessaryConditionalChildren(parentDataItem: ParentDataItem, formGroup: UntypedFormGroup, childKeys: string[]): void {
    parentDataItem.items.forEach(item => {
      const control = formGroup.controls[item.key];
      if (childKeys.some(key => key === item.key)) {
        this.setVisibilityForConditionalChild(item, control, true);
      } else {
        this.setVisibilityForConditionalChild(item, control, false);
      }
    });
  }

  /**
   * There are some values in the form that are not meant to be returned with the data upon
   * form submission. This method disables those fields which removes them from the form's value.
   * This method then grabs the form value, and then re-enables the appropriate form values.
   *
   * @param {AbstractControl} abstractControl: a root level control with nested controls
   * @param {FormDataItem[]} dataItems: an array of data items.
   * @returns {any}: the value of the form without the extra display values for items such as dropdowns with children.
   */
  // TODO: Disabling a root FormGroup (or indirectly by disabling all of the children), causes the disable() not to work
  // This is an existing bug and needs to be re-evaluated.
  getFormValues(abstractControl: AbstractControl, dataItems: FormDataItem[]): any {
    this.toggleDisabledOnSubmit(abstractControl, dataItems, true);
    const result = abstractControl.value;
    this.toggleDisabledOnSubmit(abstractControl, dataItems, false);
    return result;
  }

  /**
   * There are some values in the form that are not meant to be returned with the data upon
   * form submission. These fields are flagged to be disabled upon submit.
   * This method crawls through the nested tree of the form items and data items to enable
   * or disable form controls.
   *
   * Once these form values have been disabled and their values have been  grabbed,
   * it is important to re-enable the form fields in order to resume normal form functions.
   *
   * @param {AbstractControl} abstractControl: a root level control with nested controls
   *                    This can either be a FormGroup or a FormControl. FormArray is not supported.
   * @param {FormDataItem[]} items: an array of data items.
   *                    If the abstractControl is a FormGroup, pass in the parentDataItem.items
   *                    If the abstractControl is a FormControl, pass in [dataItem]
   * @param {boolean} shouldDisable: a boolean to disable or enable form items
   */
  toggleDisabledOnSubmit(abstractControl: AbstractControl, items: FormDataItem[], shouldDisable: boolean): void {
    if (abstractControl instanceof UntypedFormArray) {
      return;
    }

    items.forEach(item => {

      let control: AbstractControl;
      if (abstractControl instanceof UntypedFormGroup) {
        control = abstractControl.controls[item.key];
      } else if (abstractControl instanceof UntypedFormControl) {
        control = abstractControl;
      }

      switch (item.type) {
      case FormDataItemType.Object:
      case FormDataItemType.xOf:
        this.toggleDisabledOnSubmit(control as UntypedFormGroup, (item as ParentDataItem).items, shouldDisable);
        break;
      case FormDataItemType.Enum:
      case FormDataItemType.SecuredString:
        if (item.disabledState.isDisabledOnSubmit) {
          if (shouldDisable) {
            control.disable();
          } else if (!item.disabledState.isReadOnly) {
            control.enable();
          }
        }
        break;
      }
    });
  }
}

export function getLongestFieldLabelClass(items: FormDataItem[]): string {
  const longestLabel = items
    .filter(item => {
      const isApplicableField =
        item.type === FormDataItemType.Integer ||
        item.type === FormDataItemType.String ||
        item.type === FormDataItemType.SecuredString ||
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

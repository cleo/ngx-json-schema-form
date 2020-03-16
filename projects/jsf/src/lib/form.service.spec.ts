import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { FormService } from './form.service';
import { OptionDisplayType } from './models/enum-data-item';
import { FormDataItem, FormDataItemType } from './models/form-data-item';
import { ParentDataItem } from './models/parent-data-item';
import { ValidatorService } from './validator.service';

describe('FormService', () => {
  const value = 'value';
  const key = 'key';
  const label = 'label';
  const tooltip = 'tooltip';
  const helpText = 'helpText';
  const required = true;
  const pathParts = ['path1', 'path2'];

  let service: FormService;

  beforeEach(() => {
    service = new FormService({} as ValidatorService);
  });

  describe('findAbstractControl()', () => {
    it('should return null if there is nothing in the path array', () => {
      const result = service.findAbstractControl([], new FormGroup({}));
      expect(result).toBeNull();
    });

    it('should return null if nothing is found', () => {
      const controlValue = 'value1';
      const formControl = new FormControl(controlValue);
      const formGroup = new FormGroup({ formControlKey: formControl });
      const result = service.findAbstractControl(['invalidKey'], formGroup);
      expect(result).toBeNull();
    });

    it('should find a child form Control at the root level', () => {
      const formControl = new FormControl();
      const formGroup = new FormGroup({ formControlKey: formControl });
      const result = service.findAbstractControl(['formControlKey'], formGroup);
      expect(result).toEqual(formControl);
    });

    it('should find a nested child form Control', () => {
      const formControl = new FormControl();
      const formGroup = new FormGroup({ formControlKey: formControl });
      const formGroup2 = new FormGroup({ formGroupKey: formGroup });
      const result = service.findAbstractControl(['formGroupKey', 'formControlKey'], formGroup2);
      expect(result).toEqual(formControl);
    });

    it('should return null if the path points to a FormControl, but there is more to the path', () => {
      const formControl = new FormControl();
      const formGroup = new FormGroup({ formControlKey: formControl });
      const result = service.findAbstractControl(['formControlKey', 'extraKey'], formGroup);
      expect(result).toBeNull();
    });
  });

  describe('setVisibility()', () => {
    let dataItem: FormDataItem;
    let control: FormControl;

    beforeEach(() => {
      control = new FormControl(value);
      dataItem = new FormDataItem(key, label, tooltip, helpText, required, pathParts, FormDataItemType.String, value, false, false);
    });

    it('should set a data item and formControl as visible', () => {
      service.setVisibilityForConditionalChild(dataItem, control, true);
      expect(control.disabled).toEqual(false);
      expect(dataItem.isHidden).toEqual(false);
      expect(dataItem.disabledState.isCurrentlyDisabled).toEqual(false);
    });

    it('should set a data item and formControl as hidden', () => {
      service.setVisibilityForConditionalChild(dataItem, control, false);
      expect(control.disabled).toEqual(true);
      expect(dataItem.isHidden).toEqual(true);
      expect(dataItem.disabledState.isCurrentlyDisabled).toEqual(true);
    });

    it('should not enable the formControl if the data item is read only', () => {
      dataItem.disabledState.isReadOnly = true;
      control.disable();
      service.setVisibilityForConditionalChild(dataItem, control, true);
      expect(control.disabled).toEqual(true);
    });
  });

  describe('when setting visibility for multiple children', () => {
    let parentDataItem: ParentDataItem;
    let formGroup: FormGroup;

    const childKey1 = 'childKey1';
    const childKey2 = 'childKey2';

    let child1FormControl: FormControl;
    let child2FormControl: FormControl;

    let child1DataItem: FormDataItem;
    let child2DataItem: FormDataItem;

    beforeEach(() => {
      child1DataItem = new FormDataItem(childKey1, label, tooltip, helpText, required, pathParts, FormDataItemType.String, value, false, false);
      child2DataItem = new FormDataItem(childKey2, label, tooltip, helpText, required, pathParts, FormDataItemType.String, value, false, false);
      const items: FormDataItem[] = [child1DataItem, child2DataItem];

      parentDataItem = new ParentDataItem(key, label, tooltip, helpText,
                                          required, pathParts, FormDataItemType.Object,
                                          value, false, false, items,
                                          '', OptionDisplayType.SECTIONS);

      child1FormControl = new FormControl();
      child2FormControl = new FormControl();

      formGroup = new FormGroup({ childKey1: child1FormControl, childKey2: child2FormControl });
    });

    describe('setVisibilityForAllChildren()', () => {
      it('should set all children as visible', () => {
        service.setVisibilityForAllConditionalChildren(parentDataItem, formGroup, true);

        expect(child1FormControl.disabled).toEqual(false);
        expect(child1DataItem.isHidden).toEqual(false);
        expect(child1DataItem.disabledState.isCurrentlyDisabled).toEqual(false);

        expect(child2FormControl.disabled).toEqual(false);
        expect(child2DataItem.isHidden).toEqual(false);
        expect(child2DataItem.disabledState.isCurrentlyDisabled).toEqual(false);
      });

      it('should set all children as hidden', () => {
        service.setVisibilityForAllConditionalChildren(parentDataItem, formGroup, false);

        expect(child1FormControl.disabled).toEqual(true);
        expect(child1DataItem.isHidden).toEqual(true);
        expect(child1DataItem.disabledState.isCurrentlyDisabled).toEqual(true);

        expect(child2FormControl.disabled).toEqual(true);
        expect(child2DataItem.isHidden).toEqual(true);
        expect(child2DataItem.disabledState.isCurrentlyDisabled).toEqual(true);
      });
    });

    describe('showNecessaryConditionalChildren()', () => {
      it('should set all of the child items as hidden when no child keys are passed in', () => {
        service.showNecessaryConditionalChildren(parentDataItem, formGroup, []);

        expect(child1FormControl.disabled).toEqual(true);
        expect(child1DataItem.isHidden).toEqual(true);
        expect(child1DataItem.disabledState.isCurrentlyDisabled).toEqual(true);

        expect(child2FormControl.disabled).toEqual(true);
        expect(child2DataItem.isHidden).toEqual(true);
        expect(child2DataItem.disabledState.isCurrentlyDisabled).toEqual(true);
      });

      it('should set one child as visible when one key is passed in and the others should be marked as hidden', () => {
        service.showNecessaryConditionalChildren(parentDataItem, formGroup, [ childKey1]);

        expect(child1FormControl.disabled).toEqual(false);
        expect(child1DataItem.isHidden).toEqual(false);
        expect(child1DataItem.disabledState.isCurrentlyDisabled).toEqual(false);

        expect(child2FormControl.disabled).toEqual(true);
        expect(child2DataItem.isHidden).toEqual(true);
        expect(child2DataItem.disabledState.isCurrentlyDisabled).toEqual(true);
      });

      it('should set all of the child items as visible when all the child keys are passed in', () => {
        service.showNecessaryConditionalChildren(parentDataItem, formGroup, [ childKey1, childKey2]);

        expect(child1FormControl.disabled).toEqual(false);
        expect(child1DataItem.isHidden).toEqual(false);
        expect(child1DataItem.disabledState.isCurrentlyDisabled).toEqual(false);

        expect(child2FormControl.disabled).toEqual(false);
        expect(child2DataItem.isHidden).toEqual(false);
        expect(child2DataItem.disabledState.isCurrentlyDisabled).toEqual(false);
      });
    });
  });

  describe('toggleDisabledOnSubmit()', () => {
    let formControl: FormControl;
    let dataItem: FormDataItem;

    beforeEach(() => {
      dataItem = new FormDataItem(key, label, tooltip, helpText, required, pathParts, FormDataItemType.SecuredString, value, false, false);
      dataItem.disabledState.isDisabledOnSubmit = true;
      formControl = new FormControl(value);
    });

    describe('when a single item is passed in', () => {
      it('it should toggle the form control to be disabled', () => {
        expect(formControl.disabled).toEqual(false);
        service.toggleDisabledOnSubmit(formControl, [dataItem], true);
        expect(formControl.disabled).toEqual(true);
      });

      it('it should toggle the form control to be enabled', () => {
        formControl.disable();

        expect(formControl.disabled).toEqual(true);
        service.toggleDisabledOnSubmit(formControl, [dataItem], false);
        expect(formControl.disabled).toEqual(false);
      });

      it('should not toggle form controls that are not marked as isDisabledOnSubmit', () => {
        dataItem.disabledState.isDisabledOnSubmit = false;

        expect(formControl.disabled).toEqual(false);
        service.toggleDisabledOnSubmit(formControl, [dataItem], true);
        expect(formControl.disabled).toEqual(false);
      });

      it('should not toggle form controls that are marked as isDisabledOnSubmit, but are also read-only', () => {
        formControl.disable();
        dataItem.disabledState.isReadOnly = true;

        expect(formControl.disabled).toEqual(true);
        service.toggleDisabledOnSubmit(formControl, [dataItem], false);
        expect(formControl.disabled).toEqual(true);
      });
    });

    describe('when a parent item is passed in', () => {
      let formGroup: FormGroup;
      beforeEach(() => {
        formGroup = new FormGroup({ key: formControl });
      });

      it('it should toggle the form control to be disabled', () => {
        expect(formGroup.controls[key].disabled).toEqual(false);
        service.toggleDisabledOnSubmit(formGroup, [dataItem], true);
        expect(formGroup.controls[key].disabled).toEqual(true);
      });

      it('it should toggle the form control to be enabled', () => {
        formGroup.controls[key].disable();

        expect(formGroup.controls[key].disabled).toEqual(true);
        service.toggleDisabledOnSubmit(formGroup, [dataItem], false);
        expect(formGroup.controls[key].disabled).toEqual(false);
      });

      it('should not toggle form controls that are not marked as isDisabledOnSubmit', () => {
        const key2 = 'key2';
        const dataItem2 = new FormDataItem(key2, label, tooltip, helpText, required, pathParts, FormDataItemType.SecuredString, value, false, false);
        dataItem2.disabledState.isDisabledOnSubmit = false;
        const formControl2 = new FormControl();

        formGroup.addControl(key2, formControl2);
        expect(formGroup.controls[key2].disabled).toEqual(false);
        service.toggleDisabledOnSubmit(formGroup, [dataItem, dataItem2], true);
        expect(formGroup.controls[key2].disabled).toEqual(false);
      });
    });
  });
});

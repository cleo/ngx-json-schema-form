import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { OptionDisplayType } from '../../models/enum-data-item';
import { FormDataItemType } from '../../models/form-data-item';
import { ParentDataItem } from '../../models/parent-data-item';
import { XOfDataItem, XOfType } from '../../models/xOf-data-item';
import { ValidatorService } from '../../validator.service';
import { LabelComponent } from '../form-controls/label/label.component';
import { TabsComponent } from './tabs.component';
import { TabComponent } from './tab/tab.component';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsComponent, LabelComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
  });

  function tabWith(formGroup: UntypedFormGroup): TabComponent {
    return { formGroup: () => formGroup } as unknown as TabComponent;
  }

  // Validator that mimics the enum validator's distinct error key (no `required`)
  const enumValidatorFn = (control: UntypedFormControl) =>
    control.value === 'valid' ? null : { enum: { label: 'label' } };

  describe('tabHasRequiredFields()', () => {
    it('returns false for a tab with only non-required dropdown fields', () => {
      const formGroup = new UntypedFormGroup({
        dropdown: new UntypedFormControl('', enumValidatorFn)
      });
      expect(component.tabHasRequiredFields(tabWith(formGroup))).toBe(false);
    });

    it('returns true for a tab containing a schema-required field', () => {
      const formGroup = new UntypedFormGroup({
        dropdown: new UntypedFormControl('', enumValidatorFn),
        requiredField: new UntypedFormControl('', Validators.required)
      });
      expect(component.tabHasRequiredFields(tabWith(formGroup))).toBe(true);
    });

    it('returns false for a tab with a dropdown and a non-required text field', () => {
      const formGroup = new UntypedFormGroup({
        dropdown: new UntypedFormControl('', enumValidatorFn),
        textField: new UntypedFormControl('')
      });
      expect(component.tabHasRequiredFields(tabWith(formGroup))).toBe(false);
    });

    it('returns false for a tab whose only field is a non-required oneOf (no required validator)', () => {
      const formGroup = new UntypedFormGroup({
        oneOf: new UntypedFormControl('', enumValidatorFn)
      });
      expect(component.tabHasRequiredFields(tabWith(formGroup))).toBe(false);
    });

    it('returns true for a required field nested in a sub form group', () => {
      const formGroup = new UntypedFormGroup({
        nested: new UntypedFormGroup({
          requiredField: new UntypedFormControl('', Validators.required)
        })
      });
      expect(component.tabHasRequiredFields(tabWith(formGroup))).toBe(true);
    });
  });

  describe('oneOf as the only field in a tab', () => {
    let validatorService: ValidatorService;
    let labelFixture: ComponentFixture<LabelComponent>;
    let label: LabelComponent;

    beforeEach(() => {
      validatorService = new ValidatorService();
      labelFixture = TestBed.createComponent(LabelComponent);
      label = labelFixture.componentInstance;
    });

    function buildOneOf(required: boolean): XOfDataItem {
      const child = new ParentDataItem('childKey', 'Child', '', '', false, ['childKey'],
        FormDataItemType.Object, '', false, false, [], '', OptionDisplayType.DROPDOWN);
      return new XOfDataItem('oneOf', 'label', '', '', required, ['oneOf'], 'childKey', false, false,
        OptionDisplayType.DROPDOWN, [child], '', XOfType.OneOf);
    }

    // Builds the tab form group the way the real form does: the rendered control is the
    // generated display enum (items[0]) with validators derived from its required state.
    function tabForOneOf(oneOf: XOfDataItem): TabComponent {
      const displayItem = oneOf.items[0];
      const control = new UntypedFormControl(displayItem.value, validatorService.getValidators(displayItem));
      return tabWith(new UntypedFormGroup({ [oneOf.key]: control }));
    }

    it('non-required oneOf: no field star and no tab star', () => {
      const oneOf = buildOneOf(false);
      labelFixture.componentRef.setInput('formItem', oneOf.items[0]);
      expect(label.isRequired()).toBe(false);
      expect(component.tabHasRequiredFields(tabForOneOf(oneOf))).toBe(false);
    });

    it('required oneOf: field star and tab star', () => {
      const oneOf = buildOneOf(true);
      labelFixture.componentRef.setInput('formItem', oneOf.items[0]);
      expect(label.isRequired()).toBe(true);
      expect(component.tabHasRequiredFields(tabForOneOf(oneOf))).toBe(true);
    });
  });
});

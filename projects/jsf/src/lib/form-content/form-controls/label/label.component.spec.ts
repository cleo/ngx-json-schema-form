import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormDataItem, FormDataItemType } from '../../../models/form-data-item';
import { EnumDataItem, OptionDisplayType } from '../../../models/enum-data-item';
import { SecuredStringDataItem } from '../../../models/secured-string-data-item';
import { LabelComponent } from './label.component';

describe('LabelComponent', () => {
  let component: LabelComponent;
  let fixture: ComponentFixture<LabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LabelComponent);
    component = fixture.componentInstance;
  });

  function setItem(item: FormDataItem): void {
    fixture.componentRef.setInput('formItem', item);
  }

  describe('isRequired()', () => {
    it('returns false for a dropdown enum that is not required', () => {
      const item = new EnumDataItem('key', 'label', '', '', false, ['key'], '', false, false,
        OptionDisplayType.DROPDOWN, { enum: ['', 'a'], type: 'string' } as any);
      setItem(item);
      expect(component.isRequired()).toBe(false);
    });

    it('returns true for a dropdown enum that is required', () => {
      const item = new EnumDataItem('key', 'label', '', '', true, ['key'], '', false, false,
        OptionDisplayType.DROPDOWN, { enum: ['', 'a'], type: 'string' } as any);
      setItem(item);
      expect(component.isRequired()).toBe(true);
    });

    it('returns true for a radio-button enum', () => {
      const item = new EnumDataItem('key', 'label', '', '', false, ['key'], '', false, false,
        OptionDisplayType.RADIO_BUTTONS, { enum: ['a', 'b'], type: 'string' } as any);
      setItem(item);
      expect(component.isRequired()).toBe(true);
    });

    it('returns true for a secured-string item that was required', () => {
      const item = new SecuredStringDataItem('key', 'label', '', '', true, ['key'], '', false, false, true, '');
      setItem(item);
      expect(component.isRequired()).toBe(true);
    });

    it('returns false for a non-required text item', () => {
      const item = new FormDataItem('key', 'label', '', '', false, ['key'], FormDataItemType.String, '', false, false);
      setItem(item);
      expect(component.isRequired()).toBe(false);
    });

    it('returns true for a required text item', () => {
      const item = new FormDataItem('key', 'label', '', '', true, ['key'], FormDataItemType.String, '', false, false);
      setItem(item);
      expect(component.isRequired()).toBe(true);
    });

    it('returns false for a non-required oneOf (xOf) item', () => {
      const item = new FormDataItem('key', 'label', '', '', false, ['key'], FormDataItemType.xOf, '', false, false);
      setItem(item);
      expect(component.isRequired()).toBe(false);
    });
  });
});

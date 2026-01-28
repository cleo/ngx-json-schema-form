import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';

import { JSFConfig } from '../../jsf-config';
import { EnumDataItem, OptionDisplayType } from '../../models/enum-data-item';
import { FormDataItem, FormDataItemType } from '../../models/form-data-item';
import { StringDataItem } from '../../models/string-data-item';
import { ContentBaseComponent } from '../content-base.component';

import { TextComponent } from './text/text.component';
import { SecuredTextComponent } from './secured-text/secured-text.component';
import { TextAreaComponent } from './text-area/text-area.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { RadioButtonComponent } from './radio-button/radio-button.component';
import { TableSummaryComponent } from './table-modal/table-summary.component';
import { TemplateComponent } from './template/template.component';

@Component({
    selector: 'jsf-form-control',
    standalone: true,
    imports: [
    ReactiveFormsModule,
    SecuredTextComponent,
    TextComponent,
    TextAreaComponent,
    CheckboxComponent,
    DropdownComponent,
    RadioButtonComponent,
    TableSummaryComponent,
    TemplateComponent
],
    templateUrl: './form-control.component.html',
    styleUrls: ['./form-control.component.scss'],
})

export class FormControlComponent extends ContentBaseComponent {
  @Input() formItem: FormDataItem;
  @Input() templates: any = {};
  @Input() labelLengthClass: string;

  isStringInput(): boolean {
    return this.formItem.type === FormDataItemType.String ||
      this.formItem.type === FormDataItemType.Integer;
  }

  isDropdown(): boolean {
    return this.isEnum() && (this.formItem as EnumDataItem).display === OptionDisplayType.DROPDOWN;
  }

  isRadioButton(): boolean {
    return this.isEnum() && (this.formItem as EnumDataItem).display === OptionDisplayType.RADIO_BUTTONS;
  }

  private isEnum(): boolean {
    return this.formItem.type === FormDataItemType.Enum;
  }

  isSecured(): boolean {
    return this.formItem.type === FormDataItemType.SecuredString;
  }

  isCheckbox(): boolean {
    return this.formItem.type === FormDataItemType.Boolean;
  }

  isTextArea(): boolean {
    const item = this.formItem as StringDataItem;
    return item.display && item.display.startsWith('textarea');
  }

  isArray(): boolean {
    return this.formItem.type === FormDataItemType.Array;
  }

  isTemplate(): boolean {
    return this.formItem.type === FormDataItemType.Template;
  }
}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { JSFDataItemService } from './jsf-data-item.service';
import { JSFComponent } from './jsf.component';
import { JSFService } from './jsf.service';
import { CheckboxWithChildrenComponent } from './schema-form-content/checkbox-with-children/checkbox-with-children.component';
import { CheckboxComponent } from './schema-form-content/form-controls/checkbox/checkbox.component';
import { DropdownComponent } from './schema-form-content/form-controls/dropdown/dropdown.component';
import { FormControlComponent } from './schema-form-content/form-controls/form-control.component';
import { LabelComponent } from './schema-form-content/form-controls/label/label.component';
import { RadioButtonComponent } from './schema-form-content/form-controls/radio-button/radio-button.component';
import { SecuredTextComponent } from './schema-form-content/form-controls/secured-text/secured-text.component';
import { TextComponent } from './schema-form-content/form-controls/text/text.component';
import { SchemaFormContentComponent } from './schema-form-content/jsf-content.component';
import { OneOfDropdownComponent } from './schema-form-content/one-of/one-of-dropdown/one-of-dropdown.component';
import { OneOfComponent } from './schema-form-content/one-of/one-of.component';
import { SectionComponent } from './schema-form-content/section/section.component';
import { ValidatorService } from './validator.service';

const components = [
  CheckboxComponent,
  FormControlComponent,
  CheckboxWithChildrenComponent,
  DropdownComponent,
  JSFComponent,
  LabelComponent,
  SchemaFormContentComponent,
  SectionComponent,
  OneOfComponent,
  OneOfDropdownComponent,
  RadioButtonComponent,
  TextComponent,
  SecuredTextComponent
];

const services = [
  JSFService,
  JSFDataItemService,
  ValidatorService
];

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    JSFComponent
  ],
  providers: [
    ...services
  ]
})
export class JSFModule { }

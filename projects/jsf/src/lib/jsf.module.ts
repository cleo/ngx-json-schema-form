import { AgGridModule } from '@ag-grid-community/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CheckboxWithChildrenComponent } from './form-content/checkbox-with-children/checkbox-with-children.component';
import { FormContentComponent } from './form-content/form-content.component';
import { CheckboxComponent } from './form-content/form-controls/checkbox/checkbox.component';
import { DropdownComponent } from './form-content/form-controls/dropdown/dropdown.component';
import { EventButtonComponent } from './form-content/form-controls/event-button/event-button.component';
import { FormControlComponent } from './form-content/form-controls/form-control.component';
import { LabelComponent } from './form-content/form-controls/label/label.component';
import { RadioButtonComponent } from './form-content/form-controls/radio-button/radio-button.component';
import { SecuredTextComponent } from './form-content/form-controls/secured-text/secured-text.component';
import { TextAreaComponent } from './form-content/form-controls/text-area/text-area.component';
import { TextComponent } from './form-content/form-controls/text/text.component';
import { OneOfDropdownComponent } from './form-content/one-of/one-of-dropdown/one-of-dropdown.component';
import { OneOfComponent } from './form-content/one-of/one-of.component';
import { SectionComponent } from './form-content/section/section.component';
import { CellRendererComponent } from './form-content/table/cells/cell-renderer.component';
import { CheckboxCellComponent } from './form-content/table/cells/checkbox-cell.component';
import { DropdownCellComponent } from './form-content/table/cells/dropdown-cell.component';
import { TextCellComponent } from './form-content/table/cells/text-cell.component';
import { TableComponent } from './form-content/table/table.component';
import { TabComponent } from './form-content/tabs/tab/tab.component';
import { TabsComponent } from './form-content/tabs/tabs.component';
import { TabstripComponent } from './form-content/tabs/tabstrip/tabstrip.component';
import { FormDataItemService } from './form-data-item.service';
import { FormService } from './form.service';
import { JSFComponent } from './jsf.component';
import { SchemaTranslationService } from './schema-translation.service';
import { ValidatorService } from './validator.service';

const components = [
  TabsComponent,
  TabComponent,
  TabstripComponent,
  CheckboxComponent,
  FormControlComponent,
  CheckboxWithChildrenComponent,
  DropdownComponent,
  EventButtonComponent,
  JSFComponent,
  LabelComponent,
  FormContentComponent,
  SectionComponent,
  OneOfComponent,
  OneOfDropdownComponent,
  RadioButtonComponent,
  TextComponent,
  SecuredTextComponent,
  TextAreaComponent,
  TableComponent,
  CheckboxCellComponent,
  DropdownCellComponent,
  TextCellComponent,
  CellRendererComponent
];

const services = [
  FormService,
  FormDataItemService,
  SchemaTranslationService,
  ValidatorService
];

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([])
  ],
  exports: [
    JSFComponent
  ],
  providers: [
    ...services
  ]
})
export class JSFModule { }

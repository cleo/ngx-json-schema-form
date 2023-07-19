import { AgGridModule } from 'ag-grid-angular';
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
import { AlertComponent } from './form-content/form-controls/table-modal/alert/alert.component';
import { AlertService } from './form-content/form-controls/table-modal/alert/alert.service';
import { ModalOutletComponent } from './form-content/form-controls/table-modal/modal/modal-outlet.component';
import { ModalComponent } from './form-content/form-controls/table-modal/modal/modal.component';
import { TableSummaryComponent } from './form-content/form-controls/table-modal/table-summary.component';
import { CheckboxCellComponent } from './form-content/form-controls/table-modal/table/cells/checkbox-cell.component';
import { DropdownCellComponent } from './form-content/form-controls/table-modal/table/cells/dropdown-cell.component';
import { TextCellComponent } from './form-content/form-controls/table-modal/table/cells/text-cell.component';
import { CellRendererComponent } from './form-content/form-controls/table-modal/table/renderers/cell-renderer.component';
import { TableModalComponent } from './form-content/form-controls/table-modal/table/table-modal.component';
import { TableModalService } from './form-content/form-controls/table-modal/table/table-modal.service';
import { TemplateComponent } from './form-content/form-controls/template/template.component';
import { TextAreaComponent } from './form-content/form-controls/text-area/text-area.component';
import { TextComponent } from './form-content/form-controls/text/text.component';
import { OneOfComponent } from './form-content/one-of/one-of.component';
import { SectionComponent } from './form-content/section/section.component';
import { TabComponent } from './form-content/tabs/tab/tab.component';
import { TabsComponent } from './form-content/tabs/tabs.component';
import { FormDataItemService } from './form-data-item.service';
import { FormService } from './form.service';
import { JSFComponent } from './jsf.component';
import { SchemaTranslationService } from './schema-translation.service';
import { ValidatorService } from './validator.service';

const tableComponents = [
  AlertComponent,
  CellRendererComponent,
  CheckboxCellComponent,
  DropdownCellComponent,
  ModalComponent,
  ModalOutletComponent,
  TableModalComponent,
  TableSummaryComponent,
  TextCellComponent
];

const components = [
  TabsComponent,
  TabComponent,
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
  RadioButtonComponent,
  TextComponent,
  TemplateComponent,
  SecuredTextComponent,
  TextAreaComponent,
  ...tableComponents
];

const services = [
  FormService,
  FormDataItemService,
  SchemaTranslationService,
  ValidatorService,
  TableModalService,
  AlertService
];

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    CommonModule,
    FormsModule.withConfig({callSetDisabledState: 'whenDisabledForLegacyCode'}),
    ReactiveFormsModule.withConfig({callSetDisabledState: 'whenDisabledForLegacyCode'}),
    AgGridModule
  ],
  exports: [
    JSFComponent
  ],
  providers: [
    ...services
  ]
})
export class JSFModule { }

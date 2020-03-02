import { Component, OnInit, ViewChild } from '@angular/core';
import { RequiredSchemaValueValidationService } from '../../../jsf-validation/src/lib/required-schema-value-validation.service';
import { JSFConfig } from '../../../jsf/src/lib/jsf-config';
import { JSFDataItemService } from '../../../jsf/src/lib/jsf-data-item.service';
import { JSFComponent } from '../../../jsf/src/lib/jsf.component';
import { FormDataItem } from '../../../jsf/src/lib/models/form-data-item';
import Schema from './schema.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(JSFComponent, { static: false }) schemaFormComponent: JSFComponent;
  config = new JSFConfig(false, false, true);
  isSubmitDisabled = true;
  formDataItems: FormDataItem[];
  showValidationMessage = false;
  isValid = false;

  constructor(private formDataItemService: JSFDataItemService) {}

  ngOnInit(): void {
    this.formDataItems = this.formDataItemService.getFormDataItems(Schema, {}, false);
  }

  updateSubmitButtonStatus(disableSubmit: boolean): void {
    this.isSubmitDisabled = disableSubmit;
  }

  emitTotalHeight(formHeight: number): void {
    // console.log('Form Height: ', formHeight);
  }

  onSubmit(): void {
    const jsonData = this.schemaFormComponent.getFormValues();
    this.isValid = this.validate(Schema, jsonData);
    this.showValidationMessage = true;
  }

  onCancel(): void {
    location.reload();
  }

  private validate(schema: any, values: any): boolean {
    return RequiredSchemaValueValidationService.valuesHaveRequiredKeys(schema, values, true);
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { RequiredSchemaValueValidationService } from '../../../sfl-validation/src/lib/required-schema-value-validation.service';
import { FormDataItem } from '../../../sfl/src/lib/models/form-data-item';
import { SFLConfig } from '../../../sfl/src/lib/sfl-config';
import { SFLDataItemService } from '../../../sfl/src/lib/sfl-data-item.service';
import { SFLComponent } from '../../../sfl/src/lib/sfl.component';
import Schema from './schema.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(SFLComponent, { static: false }) schemaFormComponent: SFLComponent;
  config = new SFLConfig(false, false, true);
  isSubmitDisabled = true;
  formDataItems: FormDataItem[];
  showValidationMessage = false;
  isValid = false;

  constructor(private formDataItemService: SFLDataItemService) {}

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

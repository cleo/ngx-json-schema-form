import { Component, OnInit, ViewChild } from '@angular/core';
import { RequiredSchemaValueValidationService } from '../../../jsf-validation/src/lib/required-schema-value-validation.service';
import { JSFConfig } from '../../../jsf/src/lib/jsf-config';
import { JSFJsonSchema } from '../../../jsf/src/lib/jsf-json-schema';
import { JSFSchemaData } from '../../../jsf/src/lib/jsf-schema-data';

import { AbstractControl } from '@angular/forms';
import { JSFComponent } from '../../../jsf/src/lib/jsf.component';
import dataV2 from './dataV2.json';
import dataV1 from './outdatedSchema/dataV1.json';
import schemaV1 from './outdatedSchema/schemaV1.json';
import schemaV2 from './schemaV2.json';
import { TemplateComponent } from './template-component/template.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(JSFComponent) jsfComponent: JSFComponent;
  @ViewChild(TemplateComponent) templateComponent: TemplateComponent;
  config: JSFConfig = { enableCollapsibleSections: false, showSectionDivider: true };
  isSubmitDisabled = true;
  showValidationMessage = false;
  isValid = false;
  schemaData: JSFSchemaData;
  schema: JSFJsonSchema;
  data: any = {};
  version: JSFVersion = JSFVersion.V2;
  isEdit = false;

  ngOnInit(): void {
    this.setSchemas();
    this.schemaData = new JSFSchemaData(this.schema, this.data);
  }

  setSchemas(): any {
    switch (this.version) {
    case JSFVersion.V1 :
      this.schema = schemaV1;
      if (this.isEdit) {
        this.data = dataV1;
      }
      break;
    case JSFVersion.V2:
      this.schema = schemaV2;
      if (this.isEdit) {
        this.data = dataV2;
      }
      break;
    }
  }

  updateSubmitButtonStatus(disableSubmit: boolean): void {
    this.isSubmitDisabled = disableSubmit;
  }

  emitTotalHeight(formHeight: number): void {
    // console.log('Form Height: ', formHeight);
  }

  onSubmit(): void {
    const jsonData = this.jsfComponent.getFormValues();
    this.isValid = this.validate(this.schema, jsonData);
    this.showValidationMessage = true;
    // console.log(JSON.stringify(jsonData));
  }

  onCancel(): void {
    location.reload();
  }

  onLogForm(): void {
    // console.log(this.jsfComponent.form);
  }

  onLogFormValues(): void {
    // console.log(this.jsfComponent.getFormValues());
  }

  private validate(schema: any, values: any): boolean {
    return RequiredSchemaValueValidationService.valuesHaveRequiredKeys(schema, values, true);
  }

  buttonEvent(event: any): void {
    //console.log('in buttonEvent in app.component.ts: \n', event);
  }

  templateEvent(event: any): void {
    // Send the template event back to the corresponding component so it can set values
    this.templateComponent.setValuesInJSF(event);
  }

}

export interface TemplateEvent {
  key: string;
  targetPaths: TemplateTarget[];
}

export interface TemplateTarget {
  path: string;
  formControl: AbstractControl;
  data: any;
}

export enum JSFVersion {
  V1,
  V2
}

import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { TemplateDataItem } from '../../../models/template-data-item';
import { FormControlBase } from '../form-control-base';

@Component({
  selector: 'jsf-template',
  templateUrl: './template.component.html',
  styleUrls: ['template.component.scss']
})
export class TemplateComponent extends FormControlBase  implements OnInit{
  @Input() templates: any = {};

  get formItemAsTemplateType(): TemplateDataItem {
    return this.formItem as TemplateDataItem;
  }

  get template() {
    return this.templates[this.formItemAsTemplateType.templateName];
  }

  // get templateRef(): TemplateRef<any> {
  //   let templateName = this.formItemAsTemplateType.templateName;
  //   return templateName as TemplateRef<any>;
  // }

  ngOnInit() {
    console.log("Creating Template comonent");
    console.log("Okapi template name " + this.formItemAsTemplateType.templateName);
  }
}

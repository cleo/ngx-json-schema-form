import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormDataItem, FormDataItemType } from '../../../models/form-data-item';
import { StringDataItem, StringFormat, StringLengthOptions } from '../../../models/string-data-item';
import { FormControlBase } from '../form-control-base';
import { TemplateDataItem } from '../../../models/template-data-item';
import { FormControl } from '@angular/forms';
import { ArrayDataItem } from '../../../models/array-data-item';
import { map, takeUntil } from 'rxjs/operators';
import { getInputValue$ } from '../../../component-life-cycle';

@Component({
  selector: 'jsf-template',
  templateUrl: './template.component.html',
  styleUrls: ['template.component.scss']
})
export class TemplateComponent extends FormControlBase  implements OnInit{
  get formItemAsTemplateType(): TemplateDataItem {
    return this.formItem as TemplateDataItem;
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

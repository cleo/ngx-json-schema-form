import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { TemplateDataItem } from '../../../models/template-data-item';
import { FormControlBase } from '../form-control-base';

@Component({
  selector: 'jsf-template',
  templateUrl: './template.component.html',
  styleUrls: ['template.component.scss']
})
export class TemplateComponent extends FormControlBase  implements OnInit {
  @Input() templates: any = {};

  @HostListener('change') run()
  {
    console.log('ss HostListener change fired');
    //console.log({key: this.formItemAsTemplateType.templateName, targetPaths: this.formItemAsTemplateType.targetPaths});
    this.templateEvent.emit({key: this.formItemAsTemplateType.templateName, targetPaths: this.formItemAsTemplateType.targetPaths });
  }

  get formItemAsTemplateType(): TemplateDataItem {
    return this.formItem as TemplateDataItem;
  }

  get template() {
    return this.templates[this.formItemAsTemplateType.templateName];
  }

  ngOnInit() {
    console.log("Creating Template comonent");
    console.log("Okapi template name " + this.formItemAsTemplateType.templateName);
  }

}

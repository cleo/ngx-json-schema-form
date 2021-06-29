import { Component, HostListener, Input, OnInit } from '@angular/core';
import { TemplateDataItem } from '../../../models/template-data-item';
import { FormControlBase } from '../form-control-base';

@Component({
  selector: 'jsf-template',
  templateUrl: './template.component.html',
  styleUrls: ['template.component.scss']
})
export class TemplateComponent extends FormControlBase  implements OnInit {
  @Input() templates: any = {};

  @HostListener('click', ['$event', '$event.target'])
  @HostListener('change', ['$event', '$event.target'])
  run(event: any, targetElement: HTMLElement): void {
    if (event.type === 'change' || (targetElement && targetElement.nodeName === 'BUTTON' && event.type === 'click')) {
      this.templateEvent.emit({key: this.formItemAsTemplateType.templateName, targetPaths: this.formItemAsTemplateType.targetPaths});
    }
  }

  get formItemAsTemplateType(): TemplateDataItem {
    return this.formItem as TemplateDataItem;
  }

  get template() {
    return this.templates[this.formItemAsTemplateType.templateName];
  }

  ngOnInit() {
  }

}

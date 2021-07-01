import { AfterViewInit, Component, HostListener, Input, OnInit } from '@angular/core';
import { TemplateDataItem } from '../../../models/template-data-item';
import { FormControlBase } from '../form-control-base';

@Component({
  selector: 'jsf-template',
  templateUrl: './template.component.html'
})
export class TemplateComponent extends FormControlBase implements AfterViewInit {
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

  ngAfterViewInit() {
    // When we start up, then emit an event that will return the current values so that the template can set existing values
    this.templateEvent.emit({key: this.formItemAsTemplateType.templateName, targetPaths: this.formItemAsTemplateType.targetPaths});
  }
}

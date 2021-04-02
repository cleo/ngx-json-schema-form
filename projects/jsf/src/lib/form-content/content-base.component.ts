import { Directive, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { JSFConfig } from '../jsf-config';

@Directive()
export class ContentBaseComponent {
  @Input() formGroup: FormGroup;
  @Input() config: JSFConfig;
  @Input() isEdit: boolean;
  @Input() testTemplate: TemplateRef<any>;
  @Output() buttonEvent: EventEmitter<{ key: string; targetPaths: string[] }> = new EventEmitter();

  onButtonEvent(event: { key: string; targetPaths: string[] }): void {
    this.buttonEvent.next(event);
  }
}

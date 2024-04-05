import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ComponentLifeCycle } from '../component-life-cycle';
import { JSFConfig } from '../jsf-config';

@Directive()
export class ContentBaseComponent extends ComponentLifeCycle {
  @Input() formGroup: UntypedFormGroup;
  @Input() config: JSFConfig;
  @Input() isEdit: boolean;
  @Input() templates: any = {};
  @Output() buttonEvent: EventEmitter<{ key: string; targetPaths: string[] }> = new EventEmitter();
  @Output() templateEvent: EventEmitter<{ key: string; targetPaths: string[] }> = new EventEmitter();
  @Output() manualFormChangeEvent: EventEmitter<any> = new EventEmitter();

  onButtonEvent(event: { key: string; targetPaths: string[] }): void {
    this.buttonEvent.next(event);
  }

  onTemplateEvent(event: { key: string; targetPaths: string[] }): void {
    this.templateEvent.emit(event);
  }

  onManualFormChangeEvent(): void {
    this.manualFormChangeEvent.emit();
  }
}

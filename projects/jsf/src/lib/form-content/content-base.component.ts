import { Directive, input, output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ComponentLifeCycle } from '../component-life-cycle';
import { JSFConfig } from '../jsf-config';

@Directive()
export class ContentBaseComponent extends ComponentLifeCycle {
  // Migrated to signals - made optional for components that don't use them
  formGroup = input<UntypedFormGroup | undefined>(undefined);
  config = input<JSFConfig | undefined>(undefined);
  isEdit = input<boolean>(false);
  templates = input<any>({});
  buttonEvent = output<{ key: string; targetPaths: string[] }>();
  templateEvent = output<{ key: string; targetPaths: string[] }>();
  manualFormChangeEvent = output<any>();

  onButtonEvent(event: { key: string; targetPaths: string[] }): void {
    this.buttonEvent.emit(event);
  }

  onTemplateEvent(event: { key: string; targetPaths: string[] }): void {
    this.templateEvent.emit(event);
  }

  onManualFormChangeEvent(): void {
    this.manualFormChangeEvent.emit(undefined);
  }
}

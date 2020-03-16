import { EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { JSFConfig } from '../jsf-config';

export class ContentBaseComponent {
  @Input() formGroup: FormGroup;
  @Input() config: JSFConfig;
  @Input() isEdit: boolean;
  @Output() buttonEvent: EventEmitter<{ key: string; targetPaths: string[] }> = new EventEmitter();

  onButtonEvent(event: { key: string; targetPaths: string[] }): void {
    this.buttonEvent.next(event);
  }
}

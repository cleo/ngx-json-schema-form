import {  Component, EventEmitter, Output } from '@angular/core';
import { FormControlBase } from '../form-control-base';

@Component({
  selector: 'sfl-check-box',
  templateUrl: './checkbox.component.html',
  styleUrls: [ './checkbox.component.scss']
})
export class CheckboxComponent extends FormControlBase {
  @Output() toggle: EventEmitter<boolean> = new EventEmitter();

  onClick(): void {
    setTimeout(() => this.toggle.emit(this.formGroup.controls[this.formItem.key].value));
  }
}

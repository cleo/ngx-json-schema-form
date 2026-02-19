import {  Component, Injectable, output } from '@angular/core';
import { FormControlBase } from '../form-control-base';
import { ReactiveFormsModule } from '@angular/forms';
import { LabelComponent } from '../label/label.component';

@Component({
    selector: 'jsf-check-box',
    standalone: true,
    imports: [
    ReactiveFormsModule,
    LabelComponent
],
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent extends FormControlBase {
  // eslint-disable-next-line @angular-eslint/no-output-native
  toggle = output<boolean>();

  onClick(): void {
    setTimeout(() => this.toggle.emit(this.formGroup()?.controls[this.formItem().key].value));
  }
}

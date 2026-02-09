import {  Component, Inject, Injectable, output } from '@angular/core';
import { FormControlBase } from '../form-control-base';
import { ReactiveFormsModule } from '@angular/forms';
import { LabelComponent } from '../label/label.component';

@Injectable({ providedIn: 'root' })
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
  toggle = output<boolean>();

  onClick(): void {
    setTimeout(() => this.toggle.emit(this.formGroup()?.controls[this.formItem().key].value));
  }
}

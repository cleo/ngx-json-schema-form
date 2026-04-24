import { Component } from '@angular/core';
import { EnumDataItem } from '../../../models/enum-data-item';
import { FormControlBase } from '../form-control-base';

import { ReactiveFormsModule } from '@angular/forms';
import { LabelComponent } from '../label/label.component';

@Component({
  selector: 'jsf-radio-button',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LabelComponent
  ],
  templateUrl: './radio-button.component.html',
  styleUrls: ['radio-button.component.scss']
})
export class RadioButtonComponent extends FormControlBase {
  get formItemAsEnumType(): EnumDataItem {
    return this.formItem() as EnumDataItem;
  }
}

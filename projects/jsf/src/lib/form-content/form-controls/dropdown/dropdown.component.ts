import { Component, EventEmitter, Output } from '@angular/core';
import { EnumDataItem } from '../../../models/enum-data-item';
import { FormControlBase } from '../form-control-base';
import { ReactiveFormsModule } from '@angular/forms';
import { LabelComponent } from '../label/label.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'jsf-drop-down',
    standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      LabelComponent
    ],
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent extends FormControlBase {
  @Output() selectedKey: EventEmitter<string> = new EventEmitter();

  get formItemAsEnumType(): EnumDataItem {
    return this.formItem as EnumDataItem;
  }

  onChange(): void {
    const key = this.formItemAsEnumType.enumOptions.find(option => option.key === this.formControl.value).key;
    this.selectedKey.emit(key);
  }
}

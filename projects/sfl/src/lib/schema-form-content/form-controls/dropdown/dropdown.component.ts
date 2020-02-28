import { Component, EventEmitter, Output } from '@angular/core';
import { EnumDataItem } from '../../../models/enum-data-item';
import { FormControlBase } from '../form-control-base';

@Component({
  selector: 'sfl-drop-down',
  templateUrl: './dropdown.component.html',
  styleUrls: [ './dropdown.component.scss']
})
export class DropdownComponent extends FormControlBase {
  @Output() selectedKey: EventEmitter<string> = new EventEmitter();

  getDefaultId(): string {
    return `${this.formItem.path}.default`;
  }

  showDefault(): boolean {
    return !this.formControl.value || !this.formItem.required;
  }

  isDefaultSelected(): boolean {
    return !this.formControl.value;
  }

  get formItemAsEnumType(): EnumDataItem {
    return this.formItem as EnumDataItem;
  }

  onChange(): void {
    const key = this.formControl.value ?
      this.formItemAsEnumType.enumOptions.find(option => option.key === this.formControl.value).key
      : '';
    this.selectedKey.emit(key);
  }
}

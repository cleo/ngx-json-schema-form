import { Component, effect, input, output } from '@angular/core';
import { EnumDataItem, EnumOption } from '../../../../../models/enum-data-item';
import { ContentBaseComponent } from '../../../../content-base.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'jsf-dropdown-cell',
    standalone: true,
    imports: [FormsModule],
    template: `
      <select [ngModel]="params().value"
        (ngModelChange)="onChange($event)"
        [disabled]="params().item.disabledState.isReadOnly">
        @for (option of options; track option.key) {
          <option
            [id]="option.path"
            [ngValue]="option.key">
            {{option.text}}
          </option>
        }
      </select>
    `
})
export class DropdownCellComponent extends ContentBaseComponent {
  params = input.required<any>();
  valueChanged = output<string>();

  public options: EnumOption[] = [];

  constructor() {
    super();
    effect(() => {
      const params = this.params();
      if (params?.item) {
        this.options = (params.item as EnumDataItem).enumOptions;
      }
    });
  }

  onChange(newValue: string) {
    if (this.params()?.item) {
      this.params().value = newValue;
      this.params().data[this.params().item.key] = newValue;
      this.valueChanged.emit(newValue);
    }
  }
}
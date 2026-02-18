import { Component, effect, input, output } from '@angular/core';
import { EnumDataItem, EnumOption } from '../../../../../models/enum-data-item';
import { ContentBaseComponent } from '../../../../content-base.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'jsf-dropdown-cell',
    standalone: true,
    imports: [FormsModule],
    template: `
      <select [(ngModel)]="params().value"
        (ngModelChange)="onChange()"
        [disabled]="params().item.disabledState.isReadOnly">
        @for (option of options; track option) {
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

  private readonly paramsEffect = effect(() => {
    const params = this.params();
    
    if (params?.item) {
      this.options = (params.item as EnumDataItem).enumOptions;
    }
  });

  onChange() {
    if (this.params()?.item) {
      this.params().data[this.params().item.key] = this.params().value;
      this.valueChanged.emit(this.params().value);
    }
  }
}
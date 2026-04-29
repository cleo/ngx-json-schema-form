import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentBaseComponent } from '../../../../content-base.component';

@Component({
  selector: 'jsf-checkbox-cell',
  standalone: true,
  imports: [FormsModule],
  template: `
    <input
      type="checkbox"
      [checked]="params().value"
      [disabled]="params().item.disabledState.isReadOnly"
      [(ngModel)]="params().value"
      (ngModelChange)="onChange()"
    />
  `
})
export class CheckboxCellComponent extends ContentBaseComponent {
  params = input.required<any>();
  valueChanged = output<string>();

  onChange() {
    const params = this.params();
    params.data[params.item.key] = params.value;
    this.valueChanged.emit(params.value);
  }
}

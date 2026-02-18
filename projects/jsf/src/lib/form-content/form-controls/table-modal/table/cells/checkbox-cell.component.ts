import { ChangeDetectorRef, Component, inject, input, output } from '@angular/core';
import { ContentBaseComponent } from '../../../../content-base.component';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'jsf-checkbox-cell',
    standalone: true,
    imports: [
    FormsModule
],
    template: `
      <div (click)="toggle($event)" style="cursor: pointer; display: flex; align-items: center; justify-content: center; width: 45px; height: 45px;">
        <input
          #checkbox
          type="checkbox"
          [checked]="params().value"
          [disabled]="params().item.disabledState.isReadOnly"
          style="pointer-events: none; cursor: pointer !important;"
        />
      </div>
    `
})
export class CheckboxCellComponent extends ContentBaseComponent {
  private cdr = inject(ChangeDetectorRef);

  params = input.required<any>();
  valueChanged = output<boolean>();

  toggle(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    const p = this.params();
    const newValue = !p.value;

    this.valueChanged.emit(newValue);

    p.data[p.item.key] = newValue;
    p.value = newValue;

    this.cdr.detectChanges();
  }
}

import { ChangeDetectorRef, Component, inject, input, output } from '@angular/core';
import { ContentBaseComponent } from '../../../../content-base.component';

@Component({
  selector: 'jsf-checkbox-cell',
  standalone: true,
  template: `
    <label style="cursor: pointer; display: flex; align-items: center; justify-content: center; width: 45px; height: 45px;">
      <input
        #checkbox
        type="checkbox"
        [checked]="params().value"
        [disabled]="params().item.disabledState.isReadOnly"
        (change)="onChange($event)"
      />
    </label>
  `
})
export class CheckboxCellComponent extends ContentBaseComponent {
  private cdr = inject(ChangeDetectorRef);

  params = input.required<any>();
  valueChanged = output<boolean>();

  onChange(event: Event) {
    event.stopPropagation();

    const p = this.params();
    const newValue = (event.target as HTMLInputElement).checked;

    p.data[p.item.key] = newValue;
    p.value = newValue;

    this.valueChanged.emit(newValue);

    this.cdr.detectChanges();
  }
}

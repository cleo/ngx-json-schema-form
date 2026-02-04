import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, inject, input, output, ViewChild } from '@angular/core';
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

  @ViewChild('checkbox', { read: ElementRef }) checkboxEl?: ElementRef<HTMLInputElement>;

  params = input.required<any>();
  valueChanged = output<boolean>();

  toggle(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    const p = this.params();
    const newValue = !p.value;

    // Emitir ANTES de actualizar para evitar error NG0953
    this.valueChanged.emit(newValue);

    // Actualizar el dato directamente
    p.data[p.item.key] = newValue;
    p.value = newValue;

    // Forzar detección de cambios en Angular
    this.cdr.detectChanges();

    // Notificar a AG Grid que los datos cambiaron
    // p.api.refreshCells({
    //   rowNodes: [p.node],
    //   force: true
    // });
  }
}

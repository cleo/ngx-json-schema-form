import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { CellRendererComponent } from './cell-renderer.component';

@Component({
  selector: 'jsf-checkbox-cell',
  template: `
    <input
      type="checkbox"
      [checked]="params.value"
      [disabled]="params.item.disabledState.isReadOnly"
      [(ngModel)]="params.value"
      (ngModelChange)="onChange()"
    />
    `
})
export class CheckboxCellComponent extends CellRendererComponent {
  @Input() params: any;
  @ViewChild('input', {read: ViewContainerRef}) public input;

  onChange() {
    this.params.data[this.params.item.key] = this.params.value;
  }
}

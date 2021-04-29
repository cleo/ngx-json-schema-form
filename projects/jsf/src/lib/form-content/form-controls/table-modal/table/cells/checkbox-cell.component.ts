import { Component, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ContentBaseComponent } from '../../../../content-base.component';
import { CellRendererComponent } from '../renderers/cell-renderer.component';

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
export class CheckboxCellComponent extends ContentBaseComponent {
  @Input() params: any;
  @Output() valueChanged: EventEmitter<string> = new EventEmitter();

  onChange() {
    this.params.data[this.params.item.key] = this.params.value;
    this.valueChanged.next(this.params.value);
  }
}

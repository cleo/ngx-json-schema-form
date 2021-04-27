import { AfterViewInit, Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { CellRendererComponent } from './cell-renderer.component';

@Component({
  selector: 'jsf-checkbox-cell',
  template: `
    <input
      type="checkbox"
      [checked]="params.value"
      [disabled]="params.item.disabledState.isReadOnly"
      [(ngModel)]="params.value"
    />
    `
})
export class CheckboxCellComponent extends CellRendererComponent {
  @Input() params: any;
}

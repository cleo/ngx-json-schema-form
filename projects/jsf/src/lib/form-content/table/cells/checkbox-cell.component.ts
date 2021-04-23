import { Component, Input } from '@angular/core';
import { CellRendererComponent } from './cell-renderer.component';

@Component({
  selector: 'jsf-checkbox-cell',
  template: `
    <input
      type="checkbox"
      [checked]="params.value"
      [disabled]="params.item.disabledState.isReadOnly"
    />
    `,
  styleUrls: ['../table.component.scss']
})
export class CheckboxCellComponent extends CellRendererComponent {
  @Input() params: any;
}

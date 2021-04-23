import { Component, Input } from '@angular/core';
import { CellRendererComponent } from './cell-renderer.component';

@Component({
  selector: 'jsf-text-cell',
  template: `
    <input
      type="text"
      [title]="params.value"
      [value]="params.value"
      [disabled]="params.item.disabledState.isReadOnly"
    />
    `,
  styleUrls: ['../table.component.scss']
})
export class TextCellComponent extends CellRendererComponent {
  @Input() params: any;
}

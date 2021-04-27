import { AfterViewInit, Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { CellRendererComponent } from './cell-renderer.component';

@Component({
  selector: 'jsf-text-cell',
  template: `
    <input
      class="jsf-text-cell-input"
      type="text"
      [title]="params.value"
      [value]="params.value"
      [disabled]="params.item.disabledState.isReadOnly"
      [(ngModel)]="params.value"
    />
    `
})
export class TextCellComponent extends CellRendererComponent {
  @Input() params: any;
}

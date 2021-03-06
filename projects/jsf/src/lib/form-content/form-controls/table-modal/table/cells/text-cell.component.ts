import { AfterViewInit, Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { ContentBaseComponent } from '../../../../content-base.component';

@Component({
  selector: 'jsf-text-cell',
  template: `
    <input
      class="jsf-text-cell-input"
      type="text"
      #input
      [title]="params.value"
      [value]="params.value"
      [disabled]="params.item.disabledState.isReadOnly"
      [(ngModel)]="params.value"
    />
    `
})
export class TextCellComponent extends ContentBaseComponent implements AfterViewInit {
  @Input() params: any;
  @ViewChild('input', {read: ViewContainerRef}) public input;

  ngAfterViewInit() {
    if (this.params.cellStartedEdit) {
      window.setTimeout(() => {
        this.input.element.nativeElement.focus();
      });
    }
  }
}

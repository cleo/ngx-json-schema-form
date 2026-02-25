import { AfterViewInit, Component, input, ViewChild, ViewContainerRef } from '@angular/core';
import { ContentBaseComponent } from '../../../../content-base.component';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'jsf-text-cell',
    standalone: true,
    imports: [
    FormsModule
],
    template: `
    <input
      class="jsf-text-cell-input"
      type="text"
      #input
      [title]="params().value"
      [value]="params().value"
      [disabled]="params().item.disabledState.isReadOnly"
      [ngModel]="params().value"
      (ngModelChange)="onChange($event)"
    />
    `
})

export class TextCellComponent extends ContentBaseComponent implements AfterViewInit {
  params = input.required<any>();
  @ViewChild('input', {read: ViewContainerRef}) public input;

  onChange(newValue: string) {
    const params = this.params();
    params.data[params.item.key] = newValue;
    params.value = newValue;
  }

  ngAfterViewInit() {
    if (this.params().cellStartedEdit) {
      window.setTimeout(() => {
        this.input.element.nativeElement.focus();
      });
    }
  }
}

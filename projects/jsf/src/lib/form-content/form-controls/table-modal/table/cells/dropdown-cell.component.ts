import { Component, Input } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { getInputValue$ } from '../../../../../component-life-cycle';
import { EnumDataItem, EnumOption } from '../../../../../models/enum-data-item';
import { ValidatorService } from '../../../../../validator.service';
import { CellRendererComponent } from '../renderers/cell-renderer.component';

@Component({
  selector: 'jsf-dropdown-cell',
  template: `
    <select [(ngModel)]="params.value"
            (ngModelChange)="onChange()"
            [disabled]="params.item.disabledState.isReadOnly">
      <option *ngFor="let option of options"
              [id]="option.path"
              [ngValue]="option.key">
        {{option.text}}
      </option>
    </select>
    `
})
export class DropdownCellComponent extends CellRendererComponent {
  @Input() params: any;

  public options: EnumOption[];

  constructor(validationService: ValidatorService) {
    super(validationService);
    getInputValue$(this, 'params').pipe(
      map((params: any) => {
        this.options = (params.item as EnumDataItem).enumOptions;
      }),
      takeUntil(this.ngDestroy$)).subscribe();
  }

  onChange() {
    this.params.data[this.params.item.key] = this.params.value;
  }
}

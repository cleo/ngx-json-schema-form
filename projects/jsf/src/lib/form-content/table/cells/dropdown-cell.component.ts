import { Component, Input } from '@angular/core';
import { map, take, takeUntil } from 'rxjs/operators';
import { getInputValue$ } from '../../../component-life-cycle';
import { ArrayDataItem } from '../../../models/array-data-item';
import { EnumDataItem, EnumOption } from '../../../models/enum-data-item';
import { ValidatorService } from '../../../validator.service';
import { CellRendererComponent } from './cell-renderer.component';

@Component({
  selector: 'jsf-dropdown-cell',
  template: `
    <select [(ngModel)]="params.value" class="form-control" [disabled]="params.item.disabledState.isReadOnly">
      <option *ngFor="let item of options"
              [id]="item.path"
              [ngValue]="item.key">
        {{item.text}}
      </option>
    </select>
    `,
  styleUrls: ['../table.component.scss']
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
}

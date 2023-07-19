import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { getInputValue$ } from '../../../component-life-cycle';
import { ArrayDataItem } from '../../../models/array-data-item';
import { FormDataItem } from '../../../models/form-data-item';
import { FormControlBase } from '../form-control-base';
import { ModalService } from './modal/modal.service';
import { ITableModalOptions, TableModalComponent } from './table/table-modal.component';

@Component({
  selector: 'jsf-table-summary',
  templateUrl: 'table-summary.component.html',
  styleUrls: ['table-summary.component.scss']
})

export class TableSummaryComponent extends FormControlBase implements OnInit {
  public arrayItem: ArrayDataItem;
  public modalService = new ModalService<ITableModalOptions, any>(TableModalComponent);

  ngOnInit() {
    getInputValue$(this, 'formItem').pipe(
      map((item: FormDataItem) => {
        this.arrayItem = item as ArrayDataItem;
      }),
      takeUntil(this.ngDestroy$)).subscribe();

    this.formGroup.addControl(this.formItem.key, new UntypedFormControl(this.arrayItem.value));
  }

  onEdit() {
    this.modalService.open({arrayItem: this.arrayItem}).pipe(
      filter(value => !!value),
      tap(value => this.arrayItem.value = value),
      tap(value => this.formGroup.controls[this.formItem.key].setValue(value))
    ).subscribe();
  }

  get numItems(): number {
    return this.arrayItem.value.length;
  }
}

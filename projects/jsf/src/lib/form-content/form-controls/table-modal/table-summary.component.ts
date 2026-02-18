import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { filter, tap } from 'rxjs/operators';
import { ArrayDataItem } from '../../../models/array-data-item';
import { FormControlBase } from '../form-control-base';
import { ModalService } from './modal/modal.service';
import { ITableModalOptions, TableModalComponent } from './table/table-modal.component';
import { cloneDeep, isEqual } from 'lodash';

import { LabelComponent } from '../label/label.component';
import { ModalOutletComponent } from './modal/modal-outlet.component';

@Component({
    selector: 'jsf-table-summary',
    standalone: true,
    imports: [
    ReactiveFormsModule,
    LabelComponent,
    ModalOutletComponent
],
    templateUrl: 'table-summary.component.html',
    styleUrls: ['table-summary.component.scss']
})

export class TableSummaryComponent extends FormControlBase implements OnInit {
  public arrayItem: ArrayDataItem;
  public modalService = new ModalService<ITableModalOptions, any>(TableModalComponent);

  ngOnInit() {
    this.arrayItem = this.formItem() as ArrayDataItem;

    // Add control after arrayItem is set
    const formGroup = this.formGroup();
    if (formGroup && !formGroup.controls[this.formItem().key]) {
      formGroup.addControl(this.formItem().key, new UntypedFormControl(this.arrayItem.value));
    }
  }

  onEdit() {
    const arrayItemBefore = cloneDeep(this.arrayItem.value);
    this.modalService.open({arrayItem: this.arrayItem}).pipe(
      filter(value => !!value),
      tap(value => this.arrayItem.value = value),
      tap(value => this.formGroup().controls[this.formItem().key].setValue(value)),
      tap(value => {
        if (!isEqual(value, arrayItemBefore)) {
          this.formGroup().controls[this.formItem().key].markAsDirty();
          this.manualFormChangeEvent.emit(undefined);
        }
      })
    ).subscribe();
  }

  get numItems(): number {
    return this.arrayItem.value.length;
  }
}

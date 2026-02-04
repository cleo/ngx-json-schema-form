import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { ChangeDetectionStrategy, Component, HostListener, inject, Inject } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ArrayDataItem } from '../../../../models/array-data-item';
import { FormDataItem, FormDataItemType } from '../../../../models/form-data-item';
import { AlertService } from '../alert/alert.service';
import { ModalService, MODAL_OPTIONS_TOKEN } from '../modal/modal.service';

import { ComponentLifeCycle } from '../../../../component-life-cycle';
import { CellRendererComponent } from './renderers/cell-renderer.component';
import { TableModalService } from './table-modal.service';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../alert/alert.component';
import { ModalComponent } from '../modal/modal.component';
import { AgGridAngular } from 'ag-grid-angular';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
    selector: 'jsf-table-modal',
    standalone: true,
    imports: [
      CommonModule,
      AgGridAngular,
      AlertComponent,
      ModalComponent
    ],
    templateUrl: 'table-modal.component.html',
    styleUrls: ['./table-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TableModalComponent extends ComponentLifeCycle {
  private modalService = inject(ModalService<ITableModalOptions, any>);
  private tableModalService = inject(TableModalService);
  private readonly modalOptions = inject<ITableModalOptions>(MODAL_OPTIONS_TOKEN);
  
  public alertStreamService = new AlertService();

  public arrayItem: ArrayDataItem;
  public modalTitle: string;
  public showDelete: boolean;

  public rowData$ = new ReplaySubject<any[] | null>(1);
  public pinnedTopRowData$ = new ReplaySubject<any[] | null>(1);

  public defaultColDef: ColDef = {
    editable: true,
    resizable: false,
    suppressMovable: true,
    cellRenderer: CellRendererComponent,
    cellEditor: CellRendererComponent
  };

  public rowSelectionOptions = {
    mode: 'multiRow' as const,
    checkboxes: true,
    headerCheckbox: true,
    enableClickSelection: false
  };

  public colDefs: ColDef[] = [{
    minWidth: 30,
    maxWidth: 40,
    colId: 'jsfCheckboxSelection',
    pinned: 'left'
  }];

  private params: any;
  constructor() {
    super();
    this.arrayItem = this.modalOptions.arrayItem;
    this.modalTitle = this.arrayItem.label;
    this.arrayItem.items.forEach(item => this.addItemToColDefs(item));
  }

  onGridReady(params): void {
    this.params = params;

    this.rowData$.next(this.arrayItem.value);
    this.setPinnedRowData();
    this.onResize();
  }

  onClose(): void {
    this.modalService.close(null);
  }

  onSubmit(): void {
    this.params.api.stopEditing();
    if (this.hasErrors) {
      return;
    }

    const rowData = [];
    this.params.api.forEachNode(node => rowData.push(node.data));

    this.modalService.close(rowData);
  }

  get numberOfSelectedRows(): number {
    return this.params?.api ? this.params.api.getSelectedRows().length : 0;
  }

  onRowSelected(): void {
    this.showDelete = this.numberOfSelectedRows > 0;
  }

  onDelete(): void {
    this.params.api.applyTransaction({remove: this.params.api.getSelectedRows()});
  }

  onAdd(): void {
    // this.params.api.stopEditing();
    this.params.api.applyTransaction({
      add: [this.params.api.getPinnedTopRow(0).data]
    });
    this.setPinnedRowData();
    this.alertStreamService.show('New row successfully added');
  }

  get hasErrors(): boolean {
    if (!this.params?.api) {
      return false;
    }

    let hasError = false;
    this.params.api.forEachNode(node => {
      Object.keys(node.data).forEach(key => {
          if (this.tableModalService.getErrorMessage(this.arrayItem.items.find(item => item.key === key), node.data[key])) {
            hasError = true;
            return;
          }
        }
      );
    });
    return hasError;
  }

  @HostListener('window:resize')
  onResize() {
    const allColumnIds = this.params.api.getAllDisplayedColumns().map(col => col.getColId());
    setTimeout(() =>
      this.params.api.autoSizeColumns(allColumnIds, false)
    );
  }

  private addItemToColDefs(item: FormDataItem): void {
    if (item.isHidden) {
      return;
    }

    switch (item.type) {
      case FormDataItemType.String:
      case FormDataItemType.Integer:
        this.colDefs.push({
          field: item.key,
          headerName: item.label,
          editable: !item.disabledState.isReadOnly,
          headerTooltip: item.tooltip,
          cellRendererParams: {
            item: item,
            onAdd: this.onAdd.bind(this)
          },
          cellEditorParams: {
            item: item,
            onAdd: this.onAdd.bind(this)
          }
        });
        break;
      case FormDataItemType.Boolean:
          this.colDefs.push({
          field: item.key,
          headerName: item.label,
          headerTooltip: item.tooltip,
          editable: true, 
          singleClickEdit: true, 
          suppressKeyboardEvent: () => true,
          cellRendererParams: {
            item: item,
            onAdd: this.onAdd.bind(this)
          },
          cellEditorParams: {
            item: item,
            onAdd: this.onAdd.bind(this)
          }
        });
        break;

      case FormDataItemType.Enum:
        this.colDefs.push({
          field: item.key,
          headerName: item.label,
          headerTooltip: item.tooltip,
          editable: false, 
          cellRendererParams: {
            item: item,
            onAdd: this.onAdd.bind(this)
          },
          cellEditorParams: {
            item: item,
            onAdd: this.onAdd.bind(this)
          }
        });
        break;
      default :
        throw new Error('Unsupported item in table-modal');
    }
  }

  private setPinnedRowData() {
    const pinnedData = {};
    this.arrayItem.items.forEach(item => {
      pinnedData[item.key] = item.value;
    });
    this.pinnedTopRowData$.next([pinnedData]);
  }
}

export interface ITableModalOptions {
  arrayItem: ArrayDataItem;
}

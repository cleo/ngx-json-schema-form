import { AllCommunityModules, ColDef } from '@ag-grid-community/all-modules';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ArrayDataItem } from '../../../../models/array-data-item';
import { FormDataItem, FormDataItemType } from '../../../../models/form-data-item';
import { AlertService } from '../alert/alert.service';
import { ModalService, MODAL_OPTIONS_TOKEN } from '../modal/modal.service';

import { FormControlBase } from '../../form-control-base';
import { CellRendererComponent } from './renderers/cell-renderer.component';
import { TableModalService } from './table-modal.service';

@Component({
  selector: 'jsf-table-modal',
  templateUrl: 'table-modal.component.html',
  styleUrls: ['./table-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TableModalComponent extends FormControlBase {
  public alertStreamService = new AlertService();

  public arrayItem: ArrayDataItem;
  public modalTitle: string;
  public showDelete: boolean;

  public modules = AllCommunityModules;
  public rowData$ = new ReplaySubject<any[] | null>(1);
  public pinnedTopRowData$ = new ReplaySubject<any[] | null>(1);

  public frameworkComponents = {
    jsfCellRenderer: CellRendererComponent
  };

  public defaultColDef: ColDef = {
    editable: true,
    resizable: false,
    suppressMovable: true,
    pinnedRowCellRenderer: 'jsfCellRenderer',
    cellRenderer: 'jsfCellRenderer',
    cellEditor: 'jsfCellRenderer'
  };

  public colDefs: ColDef[] = [{
    headerCheckboxSelection: true,
    checkboxSelection: true,
    minWidth: 30,
    maxWidth: 40
  }];

  private params: any;

  constructor(private modalService: ModalService<ITableModalOptions, any>,
              private changeDetectorRef: ChangeDetectorRef,
              private tableModalService: TableModalService,
              @Inject(MODAL_OPTIONS_TOKEN) private readonly modalOptions: ITableModalOptions
  ) {
    super();
    this.arrayItem = modalOptions.arrayItem;
    this.modalTitle = this.arrayItem.label;
    this.arrayItem.items.forEach(item => this.addItemToColDefs(item));
  }

  onGridReady(params): void {
    this.params = params;

    this.rowData$.next(this.arrayItem.value);
    this.setPinnedRowData();
    this.changeDetectorRef.markForCheck();
    setTimeout(() => this.onResize());
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

  onRender() {
    setTimeout(() => this.onResize());
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
    const allColumnIds = [];
    this.params.columnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.getColId());
    });

    setTimeout(() =>
      this.params.columnApi.autoSizeColumns(allColumnIds, false)
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
          pinnedRowCellRendererParams: {
            item: item,
            onAdd: this.onAdd.bind(this)
          },
          cellRendererParams: {
            item: item
          },
          cellEditorParams: {
            item: item,
            onAdd: this.onAdd.bind(this)
          }
        });
        break;
      case FormDataItemType.Boolean:
      case FormDataItemType.Enum:
        this.colDefs.push({
          field: item.key,
          headerName: item.label,
          headerTooltip: item.tooltip,
          editable: false, // Two clicks are required to edit (renderer is getting the first click). Prevent this by using the renderer to edit
          pinnedRowCellRendererParams: {
            item: item,
            onAdd: this.onAdd.bind(this)
          },
          cellRendererParams: {
            item: item
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

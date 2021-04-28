import { AllCommunityModules, ColDef, ColumnApi, GridApi } from '@ag-grid-community/all-modules';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { getInputValue$ } from '../../component-life-cycle';
import { ArrayDataItem } from '../../models/array-data-item';
import { FormDataItem, FormDataItemType } from '../../models/form-data-item';

import { ContentBaseComponent } from '../content-base.component';
import { CellRendererComponent } from './cells/cell-renderer.component';

@Component({
  selector: 'jsf-table',
  templateUrl: 'table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent extends ContentBaseComponent implements OnInit {
  @Input() arrayItem: ArrayDataItem;

  public modalTitle: string;
  public showDelete: boolean;

  public modules = AllCommunityModules;
  public frameworkComponents = {
    jsfCellRenderer: CellRendererComponent
  };
  public rowData$ = new ReplaySubject<any[] | null>(1);
  public pinnedTopRowData$ = new ReplaySubject<any[] | null>(1);
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
    maxWidth: 40,
    suppressMovable: true,
    pinned: 'left'
  }];

  private gridApi: GridApi;
  private columnApi: ColumnApi;

  constructor() {
    super();
  }

  ngOnInit() {
    getInputValue$(this, 'arrayItem').pipe(
      map((arrayItem: ArrayDataItem) => {
        this.modalTitle = arrayItem.label;
        arrayItem.items.forEach(item => this.addItemToColDefs(item));
      }),
      takeUntil(this.ngDestroy$)).subscribe();
  }

  onGridReady(params): void {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    //TODO: actually read the data
    this.rowData$.next([
      {make: 'Toyota', model: 'Celica', price: 35000, available: true, transmission: 'manual'},
      {make: 'Ford', model: 'Mondeo', price: 32000, available: false, transmission: 'automatic'},
      {make: 'Porsche', model: 'Boxter', price: 720000, available: true, transmission: 'automatic'}
    ]);
    this.setPinnedRowData();
  }

  onRender() {
    setTimeout(() => this.onResize());
  }

  get numberOfSelectedRows(): number {
    return this.gridApi ? this.gridApi.getSelectedRows().length : 0;
  }

  onRowSelected(): void {
    this.showDelete = this.numberOfSelectedRows > 0;
  }

  onDelete(): void {
    this.gridApi.applyTransaction({ remove: this.gridApi.getSelectedRows()});
  }

  onAdd(): void {
    this.gridApi.applyTransaction({
      add: [this.gridApi.getPinnedTopRow(0).data]
    });
    this.setPinnedRowData();
  }

  @HostListener('window:resize')
  onResize() {
    const allColumnIds = [];
    this.columnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.getColId());
    });

    this.columnApi.autoSizeColumns(allColumnIds, false);
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
          editable: false, // Double click required to edit. Prevent this by using the renderer to edit
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
        throw new Error('Unsupported item in array');
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

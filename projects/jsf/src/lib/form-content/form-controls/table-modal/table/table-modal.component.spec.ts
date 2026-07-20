import { TestBed } from '@angular/core/testing';
import { ColDef } from 'ag-grid-community';
import { ArrayDataItem } from '../../../../models/array-data-item';
import { FormDataItemType } from '../../../../models/form-data-item';
import { StringDataItem, StringFormat } from '../../../../models/string-data-item';
import { SchemaStringOptions } from '../../../../form-data-item.service';
import { ModalService, MODAL_OPTIONS_TOKEN } from '../modal/modal.service';
import { TableModalService } from './table-modal.service';
import { ITableModalOptions, TableModalComponent } from './table-modal.component';

describe('TableModalComponent', () => {
  const itemOptions: SchemaStringOptions = {
    format: StringFormat.None,
    display: null,
    placeholder: null,
    listDelimiter: null,
    minLength: null,
    maxLength: null,
    pattern: null
  };

  let modalService: ModalService<ITableModalOptions, any>;
  let tableModalService: jasmine.SpyObj<TableModalService>;

  function buildComponent(value: any[], fixedRows: boolean): TableModalComponent {
    const item = new StringDataItem('stringKey', 'String', null, null, false, ['arrayKey'], FormDataItemType.String, null, false, false, null, itemOptions);
    const arrayItem = new ArrayDataItem('arrayKey', 'Array', null, null, false, ['arrayKey'], FormDataItemType.Array, value, false, false, [item]);
    arrayItem.fixedRows = fixedRows;

    modalService = new ModalService<ITableModalOptions, any>(TableModalComponent);
    tableModalService = jasmine.createSpyObj('TableModalService', ['getErrorMessage']);
    tableModalService.getErrorMessage.and.returnValue(null);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: ModalService, useValue: modalService },
        { provide: TableModalService, useValue: tableModalService },
        { provide: MODAL_OPTIONS_TOKEN, useValue: { arrayItem } }
      ]
    });

    return TestBed.runInInjectionContext(() => new TableModalComponent());
  }

  function mockApi(rows: any[]): any {
    return {
      api: {
        stopEditing: jasmine.createSpy('stopEditing'),
        getAllDisplayedColumns: () => [],
        autoSizeColumns: jasmine.createSpy('autoSizeColumns'),
        applyTransaction: jasmine.createSpy('applyTransaction'),
        getPinnedTopRow: () => ({ data: { stringKey: 'new' } }),
        getSelectedRows: () => rows,
        forEachNode: (cb: (node: any) => void) => rows.forEach(data => cb({ data }))
      }
    };
  }

  function checkboxColDef(component: TableModalComponent): ColDef {
    return component.colDefs.find(col => col.colId === 'jsfCheckboxSelection');
  }

  describe('row selectability', () => {
    it('keeps all rows selectable and shows the header select-all when fixedRows is off', () => {
      const component = buildComponent([{ stringKey: 'a' }], false);
      component.onGridReady(mockApi([]));

      expect(component.isRowSelectable()).toBe(true);
      expect(checkboxColDef(component).headerCheckboxSelection).toBe(true);
    });

    it('makes rows non-selectable and hides the header select-all when fixedRows is on', () => {
      const component = buildComponent([{ stringKey: 'a' }], true);
      component.onGridReady(mockApi([]));

      expect(component.isRowSelectable()).toBe(false);
      expect(checkboxColDef(component).headerCheckboxSelection).toBe(false);
    });
  });

  describe('onSubmit', () => {
    it('emits all rows', () => {
      const component = buildComponent([{ stringKey: 'a' }], false);
      const rows = [{ stringKey: 'a' }, { stringKey: 'b' }];
      component.onGridReady(mockApi(rows));

      const closeSpy = spyOn(modalService, 'close');
      component.onSubmit();

      expect(closeSpy).toHaveBeenCalledTimes(1);
      expect(closeSpy.calls.mostRecent().args[0]).toEqual([{ stringKey: 'a' }, { stringKey: 'b' }]);
    });
  });

  describe('onAdd', () => {
    it('adds a row and emits a pinned input row when fixedRows is off', () => {
      const component = buildComponent([{ stringKey: 'a' }], false);
      const api = mockApi([]);
      component.onGridReady(api);

      let pinned: any[] = [];
      component.pinnedTopRowData$.subscribe(rows => (pinned = rows));

      component.onAdd();

      expect(api.api.applyTransaction).toHaveBeenCalledTimes(1);
      expect(pinned).not.toBeNull();
    });

    it('does not add a row and suppresses the pinned input row when fixedRows is on', () => {
      const component = buildComponent([{ stringKey: 'a' }], true);
      const api = mockApi([]);
      component.onGridReady(api);

      let pinned: any[] = [];
      component.pinnedTopRowData$.subscribe(rows => (pinned = rows));

      component.onAdd();

      expect(api.api.applyTransaction).not.toHaveBeenCalled();
      expect(pinned).toBeNull();
    });
  });

  describe('onDelete', () => {
    it('removes selected rows', () => {
      const component = buildComponent([{ stringKey: 'a' }], false);
      const api = mockApi([{ stringKey: 'a' }]);
      component.onGridReady(api);

      component.onDelete();

      expect(api.api.applyTransaction).toHaveBeenCalledTimes(1);
    });
  });
});

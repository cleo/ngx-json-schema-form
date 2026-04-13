import { Component, inject, ViewChild } from '@angular/core';
import { FormDataItemType } from '../../../../../models/form-data-item';
import { ContentBaseComponent } from '../../../../content-base.component';
import { CheckboxCellComponent } from '../cells/checkbox-cell.component';
import { DropdownCellComponent } from '../cells/dropdown-cell.component';
import { TextCellComponent } from '../cells/text-cell.component';
import { TableModalService } from '../table-modal.service';

@Component({
    selector: 'jsf-renderer',
    standalone: true,
    imports: [
    DropdownCellComponent,
    TextCellComponent,
    CheckboxCellComponent
],
    templateUrl: 'cell-renderer.component.html',
    styleUrls: ['cell-renderer.component.scss']
})
export class CellRendererComponent extends ContentBaseComponent {
  private tableModalService = inject(TableModalService);

  @ViewChild('jsfTextCell') jsfTextCell: TextCellComponent;
  @ViewChild('jsfDropdownCell') jsfDropdownCell: DropdownCellComponent;
  @ViewChild('jsfCheckboxCell') jsfCheckboxCell: CheckboxCellComponent;

  public params: any;
  public errorMessage: string;

  constructor() {
    super();
  }

  // gets called once before the renderer is used
  agInit(params: any): void {
    this.params = params;
    this.errorMessage = this.getErrorMessage;
  }

  public getValue() {
    if (this.isCheckboxType()) {
      return this.jsfCheckboxCell?.params()?.value ?? this.params?.value;
    }

    if (this.isDropdownType()) {
      return this.jsfDropdownCell?.params()?.value ?? this.params?.value;
    }

    return this.jsfTextCell?.params()?.value ?? this.params?.value;
  }

  showAddButton(): boolean {
    return this.params.node.rowPinned &&
      this.params.api.getAllDisplayedColumns().indexOf(this.params.column) === this.params.api.getAllDisplayedColumns().length - 1;
  }

  onAdd(): void {
    if (this.params.onAdd) {
      this.params.onAdd();
    }
  }

  showRequiredError(): boolean {
    return this.errorMessage && (this.params.item.required || this.params.item.enumOptions) && this.errorMessage.includes('required');
  }

  isCheckboxType(): boolean {
    return this.params.item?.type === FormDataItemType.Boolean;
  }

  isDropdownType(): boolean {
    return this.params.item?.type === FormDataItemType.Enum;
  }

  isTextType(): boolean {
    return this.params.item?.type === FormDataItemType.String || this.params.item?.type === FormDataItemType.Integer;
  }

  get getErrorMessage(): string {
    return this.tableModalService.getErrorMessage(this.params.item, this.params.value);
  }

  rendererValueChanged(newValue: any): void {
    this.errorMessage = this.getErrorMessage;
  }
}

import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormDataItemType } from '../../../models/form-data-item';
import { ValidatorService } from '../../../validator.service';
import { ContentBaseComponent } from '../../content-base.component';
import { FormControlBase } from '../../form-controls/form-control-base';
import { CheckboxCellComponent } from './checkbox-cell.component';
import { DropdownCellComponent } from './dropdown-cell.component';
import { TextCellComponent } from './text-cell.component';

@Component({
  selector: 'jsf-renderer',
  templateUrl: 'cell-renderer.component.html',
  styleUrls: ['cell-renderer.component.scss']
})
export class CellRendererComponent extends ContentBaseComponent {
  @ViewChild('jsfTextCell') jsfTextCell: TextCellComponent;
  @ViewChild('jsfDropdownCell') jsfDropdownCell: DropdownCellComponent;
  @ViewChild('jsfCheckboxCell') jsfCheckboxCell: CheckboxCellComponent;

  public params: any;
  public errorMessage: string;

  constructor(private validationService: ValidatorService) {
    super();
  }

  // gets called once before the renderer is used
  agInit(params: any): void {
    this.params = params;
    this.errorMessage = this.getErrorMessage;
  }

  public getValue() {
    if (this.isCheckboxType()) {
      return this.jsfCheckboxCell.params.value;
    }
    if (this.isDropdownType()) {
      return this.jsfDropdownCell.params.value;
    }
    return this.jsfTextCell.params.value;
  }

  showAddButton(): boolean {
    return this.params.node.rowPinned &&
      this.params.api.columnController.getAllDisplayedColumns().indexOf(this.params.column) === this.params.api.columnController.getAllDisplayedColumns().length - 1;
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
    if (!this.params.item) {
      return null;
    }

    // Create a validator for the value and reuse the non-table validations
    const validatorFn = Validators.compose(this.validationService.getValidators(this.params.item));
    if (!validatorFn) {
      return null;
    }

    const control = new FormControl();
    control.setValue(this.params.value);

    const errors = validatorFn(control);
    if (!errors) {
      return null;
    }

    return FormControlBase.formatErrorMessage(errors, this.params.item);
  }
}

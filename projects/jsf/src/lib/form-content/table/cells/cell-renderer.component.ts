import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormDataItemType } from '../../../models/form-data-item';
import { ValidatorService } from '../../../validator.service';
import { ContentBaseComponent } from '../../content-base.component';
import { FormControlBase } from '../../form-controls/form-control-base';

@Component({
  selector: 'jsf-renderer',
  template: `
    <div [class.error]="errorMessage">
      <jsf-checkbox-cell
        *ngIf="isCheckboxType()"
        [params]="params">
      </jsf-checkbox-cell>
      <jsf-dropdown-cell
        *ngIf="isDropdownType()"
        [params]="params">
      </jsf-dropdown-cell>
      <jsf-text-cell
        *ngIf="isTextType()"
        [params]="params">
      </jsf-text-cell>
      <img *ngIf="errorMessage"
           [title]="errorMessage"
           [src]="'assets/jsf-images/exclamation.svg'"
           alt="errorMessage">
      <button *ngIf="showAddButton()"
              class="btn btn-primary jsf-table-add-button"
              (click)="onAdd()">
        Add
      </button>
    </div>
    `,
  styleUrls: ['../table.component.scss']
})
export class CellRendererComponent extends ContentBaseComponent {
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

  showAddButton(): boolean {
    return this.params.node.rowPinned &&
      this.params.api.columnController.getAllDisplayedColumns().indexOf(this.params.column) === this.params.api.columnController.getAllDisplayedColumns().length - 3;
  }

  onAdd(): void {
    if (this.params.onAdd) {
      this.params.onAdd();
    }
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
    if (!this.params.item || !this.params.value) {
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

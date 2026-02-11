import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormService, getLongestFieldLabelClass } from '../../form.service';
import { ConditionalDisabledParentDataItem, CONDITIONAL_DISABLED_PARENT_VALUE_KEY } from '../../models/conditional-disabled-parent-data-item';
import { FormDataItem } from '../../models/form-data-item';
import { ContentBaseComponent } from '../content-base.component';
import { CheckboxComponent } from '../form-controls/checkbox/checkbox.component';


@Component({
    selector: 'jsf-checkbox-with-disabled-children',
    standalone: true,
    imports: [
    ReactiveFormsModule,
    CheckboxComponent
],
    templateUrl: 'checkbox-with-disabled-children.component.html',
    styleUrls: ['../common.scss', './checkbox-with-disabled-children.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxWithDisabledChildrenComponent extends ContentBaseComponent  implements OnInit {
  private formService = inject(FormService);

  formItem = input.required<ConditionalDisabledParentDataItem>();

  parentFormItem: FormDataItem;
  childFormItems: FormDataItem[] = [];
  labelLengthClass: string;

  ngOnInit(): void {
    this.initializeItems();
    this.updateChildControls(this.parentFormItem.value);
    this.labelLengthClass = getLongestFieldLabelClass(this.childFormItems);
  }

  private initializeItems(): void {
    this.formItem().items.forEach(item => {
      if (item.key === CONDITIONAL_DISABLED_PARENT_VALUE_KEY) {
        this.parentFormItem = item;
      } else {
        this.childFormItems.push(item);
      }
    });
  }

  onToggle(parentState: boolean): void {
    this.parentFormItem.value = parentState;
    this.updateChildControls(parentState);
  }

  private updateChildControls(parentValue: boolean): void {
    const formGroup = this.formGroup();
    this.childFormItems.forEach(child => {
      this.formService.setDisabledStateForConditionalChild(child, formGroup?.controls[child.key], parentValue);
    });
  }
}

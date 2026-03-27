import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormService, getLongestFieldLabelClass } from '../../form.service';
import { ConditionalParentDataItem, CONDITIONAL_PARENT_VALUE_KEY } from '../../models/conditional-parent-data-item';
import { FormDataItem } from '../../models/form-data-item';
import { ContentBaseComponent } from '../content-base.component';
import { CheckboxComponent } from '../form-controls/checkbox/checkbox.component';

@Component({
    selector: 'jsf-checkbox-with-children',
    standalone: true,
    imports: [
    ReactiveFormsModule,
    CheckboxComponent
],
    templateUrl: 'checkbox-with-children.component.html',
    styleUrls: ['../common.scss', './checkbox-with-children.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxWithChildrenComponent extends ContentBaseComponent  implements OnInit {
  private formService = inject(FormService);

  formItem = input.required<ConditionalParentDataItem>();

  parentFormItem: FormDataItem;
  childFormItems: FormDataItem[] = [];
  visibleChildFormItems: FormDataItem[] = [];
  labelLengthClass: string;

  ngOnInit(): void {
    this.initializeItems();
    this.updateChildControls(this.parentFormItem.value);
    if (this.parentFormItem.value === true) {
      this.labelLengthClass = getLongestFieldLabelClass(this.visibleChildFormItems);
    }
  }

  private initializeItems(): void {
    this.formItem().items.forEach(item => {
      if (item.key === CONDITIONAL_PARENT_VALUE_KEY) {
        this.parentFormItem = item;
      } else {
        this.childFormItems.push(item);
      }
    });
  }

  onToggle(parentState: boolean): void {
    this.parentFormItem.value = parentState;
    this.updateChildControls(parentState);
    this.labelLengthClass = getLongestFieldLabelClass(this.visibleChildFormItems);
  }

  private updateChildControls(parentValue: boolean): void {
    this.visibleChildFormItems = parentValue ? this.childFormItems : [];
    const formGroup = this.formGroup();
    this.childFormItems.forEach(child => {
      const control = formGroup?.controls[child.key];
      if (!control) {
        return;
      }
      this.formService.setVisibilityForConditionalChild(child, control, parentValue);
    });
  }
}

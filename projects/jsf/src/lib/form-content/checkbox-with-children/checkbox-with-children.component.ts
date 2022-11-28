import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormService, getLongestFieldLabelClass } from '../../form.service';
import { CONDITIONAL_PARENT_VALUE_KEY, ConditionalParentDataItem } from '../../models/conditional-parent-data-item';
import { FormDataItem } from '../../models/form-data-item';
import { ContentBaseComponent } from '../content-base.component';

@Component({
  selector: 'jsf-checkbox-with-children',
  templateUrl: 'checkbox-with-children.component.html',
  styleUrls: [ '../common.scss', './checkbox-with-children.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxWithChildrenComponent extends ContentBaseComponent  implements OnInit {
  @Input() formItem: ConditionalParentDataItem;

  parentFormItem: FormDataItem;
  childFormItems: FormDataItem[] = [];
  visibleChildFormItems: FormDataItem[] = [];
  labelLengthClass: string;

  constructor(private formService: FormService) {
    super();
  }

  ngOnInit(): void {
    this.initializeItems();
    this.updateChildControls(this.parentFormItem.value);
  }

  private initializeItems(): void {
    this.formItem.items.forEach(item => {
      if (item.key === CONDITIONAL_PARENT_VALUE_KEY) {
        this.parentFormItem = item;
        if (this.parentFormItem.value === true) {
          this.labelLengthClass = getLongestFieldLabelClass(this.visibleChildFormItems);
        }
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
    this.childFormItems.forEach(child => {
      this.formService.setVisibilityForConditionalChild(child, this.formGroup.controls[child.key], parentValue);
    });
  }
}

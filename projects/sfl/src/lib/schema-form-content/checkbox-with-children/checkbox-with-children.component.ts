import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CONDITIONAL_PARENT_VALUE_KEY, ConditionalParentDataItem } from '../../models/conditional-parent-data-item';
import { FormDataItem } from '../../models/form-data-item';
import { SFLConfig } from '../../sfl-config';
import { SFLService } from '../../sfl.service';

@Component({
  selector: 'sfl-check-box-with-children',
  templateUrl: 'checkbox-with-children.component.html',
  styleUrls: [ '../common.scss', './checkbox-with-children.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxWithChildrenComponent implements OnInit {
  @Input() formItem: ConditionalParentDataItem;
  @Input() formGroup: FormGroup;
  @Input() config: SFLConfig;

  parentFormItem: FormDataItem;
  childFormItems: FormDataItem[] = [];
  visibleChildFormItems: FormDataItem[];

  constructor(private schemaFormService: SFLService) {}

  ngOnInit(): void {
    this.initializeItems();
    this.updateChildControls();

    if (this.parentFormItem.value === true) {
      this.visibleChildFormItems = this.childFormItems;
    }
  }

  private initializeItems(): void {
    this.formItem.items.forEach(item => {
      if (item.key === CONDITIONAL_PARENT_VALUE_KEY) {
        this.parentFormItem = item;
      } else {
        this.childFormItems.push(item);
      }
    });
  }

  onToggle(parentState: boolean): void {
    this.updateFormItemsAndControls(parentState);
  }

  private updateFormItemsAndControls(parentState: boolean): void {
    this.parentFormItem.value = parentState;
    this.updateChildFormItems(parentState);
    this.updateChildControls();
  }

  private updateChildFormItems(parentState: boolean): void {
    this.visibleChildFormItems = parentState ? this.childFormItems : [];
    if (this.parentFormItem.value === false) {
      this.updateChildFormItemValues(this.formGroup, this.childFormItems);
    }
  }

  private updateChildFormItemValues(formGroup: FormGroup, items: FormDataItem[]): void {
    items
      .filter(item => !!formGroup.controls[item.key])
      .forEach(item => {
        const formControl = formGroup.controls[item.key];
        if (item instanceof ConditionalParentDataItem) {
          this.updateChildFormItemValues((formControl as FormGroup), (item as ConditionalParentDataItem).items);
        } else {
          item.value = formControl.value;
        }
      });
  }

  private updateChildControls(): void {
    if (this.parentFormItem.value === true) {
      this.formGroup = this.schemaFormService.getForm(this.formGroup, this.childFormItems);
    } else {
      this.childFormItems.forEach(item => this.formGroup.removeControl(item.key));
    }
  }
}

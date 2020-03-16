import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ConditionalParentDataItem } from '../models/conditional-parent-data-item';
import { OptionDisplayType } from '../models/enum-data-item';
import { FormDataItem, FormDataItemType } from '../models/form-data-item';
import { ParentDataItem } from '../models/parent-data-item';
import { XOfDataItem, XOfType } from '../models/xOf-data-item';
import { ContentBaseComponent } from './content-base.component';

@Component({
  selector: 'jsf-form-content',
  templateUrl: 'form-content.component.html',
  styleUrls: [ './form-content.component.scss']
})
export class FormContentComponent extends ContentBaseComponent {
  @ViewChildren('contentDiv') divs: QueryList<any>;
  @Input() formItems: FormDataItem[] = [];
  @Input() labelLengthClass: string;

  // non-tabbed items cannot be calculated only upon initialization, as the inputted items will change with oneOf dropdown selections.
  getNonTabbedItems(): FormDataItem[] {
    return this.formItems.filter(item => !this.isTabbedItem(item));
  }

  getTabbedItems(): ParentDataItem[] {
    return this.formItems
      .filter(item => !this.isHidden(item) && this.isTabbedItem(item))
      .map(item => item as ParentDataItem);
  }

  hasTabbedItems(): boolean {
    return this.formItems && this.formItems.some(item => this.isTabbedItem(item));
  }

  private isTabbedItem(item: FormDataItem): boolean {
    return this.isTabbable(item) && (item as ParentDataItem).display === OptionDisplayType.TABS;
  }

  isLastNonTabbedItem(index: number): boolean {
    return index === this.getNonTabbedItems().length - 1;
  }

  private isTabbable(item: FormDataItem): boolean {
    return !this.isHidden(item) && this.isObject(item) || this.isAllOf(item);
  }

  shouldHaveSectionDivider(index: number): boolean {
    return this.config.showSectionDivider
      ? this.isStaticObject(this.getNonTabbedItems()[index]) || this.hasTabbedItems() && this.isLastNonTabbedItem(index)
      : false;
  }

  getParentFormItem(item: FormDataItem): ParentDataItem {
    return item as ParentDataItem;
  }

  getConditionalParentFormItem(item: FormDataItem): ConditionalParentDataItem {
    return item as ConditionalParentDataItem;
  }

  getFormGroup(item: FormDataItem): FormGroup {
    return this.formGroup.controls[item.key] as FormGroup;
  }

  isSection(item: FormDataItem): boolean {
    return this.isStaticObject(item) || this.isAllOf(item);
  }

  isObject(item: FormDataItem): boolean {
    return item.type === FormDataItemType.Object;
  }

  isConditionalObject(item: FormDataItem): boolean {
     return this.isObject(item) && item instanceof ConditionalParentDataItem;
  }

  isStaticObject(item: FormDataItem): boolean {
    return this.isObject(item) && !(item instanceof ConditionalParentDataItem);
}

  isXOf(item: FormDataItem): boolean {
    return item.type === FormDataItemType.xOf;
  }

  isOneOf(item: FormDataItem): boolean {
    return this.isXOf(item) && (item as XOfDataItem).xOfType === XOfType.OneOf;
  }

  isAllOf(item: FormDataItem): boolean {
    return this.isXOf(item) && (item as XOfDataItem).xOfType === XOfType.AllOf;
  }

  isParent(item: FormDataItem): boolean {
    return this.isObject(item) || this.isXOf(item);
  }

  isHidden(item: FormDataItem): boolean {
    return item.isHidden;
  }
}

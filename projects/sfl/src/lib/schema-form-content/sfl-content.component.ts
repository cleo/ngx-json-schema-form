import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { ConditionalParentDataItem } from '../models/conditional-parent-data-item';
import { FormDataItem, FormDataItemType } from '../models/form-data-item';
import { ParentDataItem } from '../models/parent-data-item';
import { SFLConfig } from '../sfl-config';

@Component({
  selector: 'sfl-content',
  templateUrl: 'sfl-content.component.html',
  styleUrls: [ './sfl-content.component.scss']
})
export class SchemaFormContentComponent {
  @ViewChildren('contentDiv') divs: QueryList<any>;
  @Input() config: SFLConfig;
  @Input() formItems: FormDataItem[]  = [];
  @Input() form: AbstractControl;
  @Input() labelLengthClass: string;

  getParentFormItem(item: FormDataItem): ParentDataItem {
    return item as ParentDataItem;
  }

  getConditionalParentFormItem(item: FormDataItem): ConditionalParentDataItem {
    return item as ConditionalParentDataItem;
  }

  get formGroup(): FormGroup {
    return this.form as FormGroup;
  }

  isObject(item: FormDataItem): boolean {
    return item.type === FormDataItemType.Object;
  }

  isConditionalObject(item: FormDataItem): boolean {
     return this.isObject(item) && this.getConditionalParentFormItem(item).isConditional;
  }

  isStaticObject(item: FormDataItem): boolean {
    return this.isObject(item) && !this.getConditionalParentFormItem(item).isConditional;
  }

  isXOf(item: FormDataItem): boolean {
    return item.type === FormDataItemType.xOf;
  }

  isParent(item: FormDataItem): boolean {
    return this.isObject(item) || this.isXOf(item);
  }
}

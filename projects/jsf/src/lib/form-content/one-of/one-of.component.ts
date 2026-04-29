import { Component, inject, input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FormService } from '../../form.service';

import { EnumDataItem, OptionDisplayType } from '../../models/enum-data-item';
import { ParentDataItem } from '../../models/parent-data-item';
import { XOfDataItem } from '../../models/xOf-data-item';
import { ContentBaseComponent } from '../content-base.component';

import { DropdownComponent } from '../form-controls/dropdown/dropdown.component';

@Component({
  selector: 'jsf-one-of',
  standalone: true,
  imports: [
    DropdownComponent
  ],
  styleUrls: ['one-of.component.scss'],
  templateUrl: 'one-of.component.html'
})
export class OneOfComponent extends ContentBaseComponent implements OnInit {
  private formService = inject(FormService);

  xOfDataItem = input.required<XOfDataItem>();
  labelLengthClass = input<string>('');

  public selectedKey: string;
  display: any = OptionDisplayType;

  ngOnInit(): void {
    this.selectedKey = this.getDropdownFormControl().value;
    const formGroup = this.formGroup();
    if (!formGroup) return;

    if (!this.selectedKey) {
      this.formService.setVisibilityForAllConditionalChildren(this.xOfDataItem(), formGroup, false);
    } else {
      this.selectedKey = this.selectedChildDataItem.key;
      this.formService.showNecessaryConditionalChildren(this.xOfDataItem(), formGroup, [ this.selectedKey ]);
    }

    this.formService.setVisibilityForConditionalChild(this.getDropdownDataItem(), this.getDropdownFormControl(), true);
  }

  getDropdownFormControl(): UntypedFormControl {
    const formGroup = this.formGroup();
    if (!formGroup) throw new Error('Form group is not available');
    return formGroup.controls[this.xOfDataItem().key] as UntypedFormControl;
  }

  getDropdownDataItem(): EnumDataItem {
    return this.xOfDataItem().items.find(item => item.key === this.xOfDataItem().key) as EnumDataItem;
  }

  onDropdownChange(key: string): void {
    if (this.selectedKey) {
      this.formService.setVisibilityForConditionalChild(this.selectedChildDataItem, this.selectedChildFormGroup, false);
    }
    this.selectedKey = key;
    this.formService.setVisibilityForConditionalChild(this.selectedChildDataItem, this.selectedChildFormGroup, true);
  }

  get selectedChildFormGroup(): UntypedFormGroup {
    const formGroup = this.formGroup();
    if (!formGroup) throw new Error('Form group is not available');
    return formGroup.controls[this.selectedKey] as UntypedFormGroup;
  }

  get selectedChildDataItem(): ParentDataItem {
    return this.xOfDataItem().items.find(item => item.key === this.selectedKey || ((item as any).items !== undefined &&
      (item as any).items.find(childItem => childItem.key === this.selectedKey))) as ParentDataItem;
  }
}

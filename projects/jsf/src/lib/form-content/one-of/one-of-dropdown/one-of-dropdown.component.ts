import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

import { FormService, getLongestFieldLabelClass } from '../../../form.service';
import { EnumDataItem } from '../../../models/enum-data-item';
import { FormDataItem } from '../../../models/form-data-item';
import { ParentDataItem } from '../../../models/parent-data-item';
import { XOfDataItem } from '../../../models/xOf-data-item';
import { ContentBaseComponent } from '../../content-base.component';

@Component({
  selector: 'jsf-one-of-drop-down',
  templateUrl: 'one-of-dropdown.component.html',
  styleUrls: ['one-of-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OneOfDropdownComponent extends ContentBaseComponent implements OnInit {
  @ViewChild('oneOfSelect', { static: true }) select: ElementRef<HTMLSelectElement>;
  @Input() xOfDataItem: XOfDataItem;
  @Input() labelLengthClass: string;

  selectedKey: string;

  constructor(private formService: FormService) {
    super();
  }

  ngOnInit(): void {
    this.selectedKey = this.getDropdownFormControl().value;
    if (!this.selectedKey) {
      this.formService.setVisibilityForAllConditionalChildren(this.xOfDataItem, this.formGroup, false);
    } else {
      this.selectedKey = this.selectedChildDataItem.key;
      this.formService.showNecessaryConditionalChildren(this.xOfDataItem, this.formGroup, [ this.selectedKey ]);
    }

    this.formService.setVisibilityForConditionalChild(this.getDropdownDataItem(), this.getDropdownFormControl(), true);
  }

  getDropdownFormControl(): FormControl {
    return this.formGroup.controls[this.xOfDataItem.key] as FormControl;
  }

  getDropdownDataItem(): EnumDataItem {
    return this.xOfDataItem.items.find(item => item.key === this.xOfDataItem.key) as EnumDataItem;
  }

  onDropdownChange(key: string): void {
    if (this.selectedKey) {
      this.formService.setVisibilityForConditionalChild(this.selectedChildDataItem, this.selectedChildFormGroup, false);
    }
    this.selectedKey = key;
    this.formService.setVisibilityForConditionalChild(this.selectedChildDataItem, this.selectedChildFormGroup, true);
  }

  get selectedChildFormGroup(): FormGroup {
    return this.formGroup.controls[this.selectedKey] as FormGroup;
  }

  get selectedChildDataItem(): ParentDataItem {
    return this.xOfDataItem.items.find(item => item.key === this.selectedKey || ((item as any).items !== undefined &&
      (item as any).items.find(childItem => childItem.key === this.selectedKey))) as ParentDataItem;
  }
}

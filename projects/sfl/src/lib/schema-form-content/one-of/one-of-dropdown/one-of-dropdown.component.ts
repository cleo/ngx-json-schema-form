import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { EnumDataItem } from '../../../models/enum-data-item';
import { ParentDataItem } from '../../../models/parent-data-item';
import { XOfDataItem } from '../../../models/xOf-data-item';
import { SFLConfig } from '../../../sfl-config';
import { SFLService } from '../../../sfl.service';

@Component({
  selector: 'sfl-one-of-drop-down',
  templateUrl: 'one-of-dropdown.component.html',
  styleUrls: ['one-of-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OneOfDropdownComponent implements OnInit, OnDestroy {
  @ViewChild('oneOfSelect', { static: true }) select: ElementRef<HTMLSelectElement>;
  @Input() xOfDataItem: XOfDataItem;
  @Input() formGroup: FormGroup;
  @Input() config: SFLConfig;
  @Input() labelLengthClass: string;

  selectedKey: string;
  childCache: {[key: string]: AbstractControl};
  keys: string[];

  dropdownDataItem: EnumDataItem;

  constructor(private schemaFormService: SFLService) {}

  ngOnInit(): void {
    this.dropdownDataItem = this.xOfDataItem.items.find(item => item.key === this.xOfDataItem.key) as EnumDataItem;
    this.initializeValues();
    this.initializeFormGroup();
  }

  ngOnDestroy(): void {
    this.xOfDataItem.value = { [this.selectedKey]: this.selectedFormGroup.value };
    this.keys.forEach(key => {
      if (key !== this.selectedKey) {
        this.formGroup.addControl(key, this.childCache[key]);
      }
    });
  }

  private initializeValues(): void {
    this.selectedKey = this.dropdownDataItem.value;
    this.childCache = this.schemaFormService.cloneFormGroupChildControls(this.xOfDataItem.items, this.formGroup, false);
    this.keys = Object.keys(this.childCache);
  }

  private initializeFormGroup(): void {
    this.keys.forEach(key => {
      if (key !== this.dropdownDataItem.key) {
        this.formGroup.removeControl(key);
      }
    });

    if (this.selectedKey) {
      this.formGroup.addControl(this.selectedKey, this.selectedFormGroup);
    }
  }

  get selectedFormGroup(): FormGroup {
    return this.childCache[this.selectedKey] as FormGroup;
  }

  get selectedOneOfChildItem(): ParentDataItem {
    return this.xOfDataItem.items.find(item => item.key === this.selectedKey) as ParentDataItem;
  }

  onSelectValue(key: string): void {
    if (key) {
      this.formGroup.removeControl(this.selectedKey);
      this.selectedKey = key;
      this.formGroup.addControl(this.selectedKey, this.selectedFormGroup);
    } else {
      this.selectedKey = key;
    }
  }

  getDropdownDataItem(): EnumDataItem {
    return this.xOfDataItem.items.find(item => item.key === this.xOfDataItem.key) as EnumDataItem;
  }
}

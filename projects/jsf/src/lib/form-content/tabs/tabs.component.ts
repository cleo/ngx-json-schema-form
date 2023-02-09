import { AfterContentInit, AfterViewInit, Component, ContentChildren, Input, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { getLongestFieldLabelClass } from '../../form.service';
import { FormDataItem } from '../../models/form-data-item';
import { ParentDataItem } from '../../models/parent-data-item';
import { ContentBaseComponent } from '../content-base.component';
import { TabComponent } from './tab/tab.component';

@Component({
  selector: 'jsf-tabs',
  templateUrl: 'tabs.component.html',
  styleUrls: ['tabs.component.scss']
})
export class TabsComponent extends ContentBaseComponent implements AfterContentInit {
  @ContentChildren(TabComponent) public tabs: QueryList<TabComponent>;
  @Input() items: ParentDataItem[];
  @Input() public title = '';

  selectedTab: TabComponent;

  ngAfterContentInit(): void {
    this.tabs.first.selected = true;
    this.selectedTab = this.tabs.first;
  }

  getFormGroup(item: FormDataItem): FormGroup {
    return this.formGroup.controls[item.key] as FormGroup;
  }

  getLabelLengthClass(tab: ParentDataItem): string {
    return getLongestFieldLabelClass(tab.items);
  }

  onTabClicked(clickedTab: TabComponent) {
    if (clickedTab === undefined || clickedTab.selected) {
      return;
    }

    this.selectedTab.selected = false;
    this.selectedTab = this.tabs.find(tab => tab.dataItem.label === clickedTab.dataItem.label);
    this.selectedTab.selected = true;
  }

  isValid(tab: TabComponent) {
    return tab.formGroup.valid;
  }

  isDisabled(tab: TabComponent) {
    return tab.formGroup.disabled;
  }

  tabHasRequiredFields(tab: TabComponent): boolean {
    return this.formGroupHasRequiredFields(tab.formGroup);
  }

  private formGroupHasRequiredFields(formGroup: FormGroup): boolean {
    const controls: AbstractControl[] = Object.values(formGroup.controls);
    return controls.some(control => {
      if (control instanceof FormGroup) {
        return this.formGroupHasRequiredFields(control);
      }
      return this.formControlIsRequired(control);
    });
  }

  private formControlIsRequired(control: AbstractControl): boolean {
    if (!control.validator) {
      return false;
    }

    const validator = control.validator({} as AbstractControl);
    return validator && validator.required;
  }
}

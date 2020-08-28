import { AfterContentInit, Component, ContentChildren, Input, QueryList } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'jsf-tabstrip',
  templateUrl: './tabstrip.component.html',
  styleUrls: [ './tabstrip.component.scss']
})
export class TabstripComponent implements AfterContentInit {
  @ContentChildren(TabComponent) public tabs: QueryList<TabComponent>;
  @Input() public title = '';
  selectedTab: TabComponent;

  ngAfterContentInit(): void {
    this.tabs.first.selected = true;
    this.selectedTab = this.tabs.first;
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
    return tab.content.formGroup.valid;
  }

  isDisabled(tab: TabComponent) {
    return tab.content.formGroup.disabled;
  }

  tabHasRequiredFields(tab: TabComponent): boolean {
    return this.formGroupHasRequiredFields(tab.content.formGroup);
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

import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getLongestFieldLabelClass } from '../../form.service';
import { FormDataItem } from '../../models/form-data-item';
import { ParentDataItem } from '../../models/parent-data-item';
import { ContentBaseComponent } from '../content-base.component';

@Component({
  selector: 'jsf-tabs',
  templateUrl: 'tabs.component.html',
  styleUrls: ['tabs.component.scss']
})
export class TabsComponent extends ContentBaseComponent {
  @Input() items: ParentDataItem[];

  getFormGroup(item: FormDataItem): FormGroup {
    return this.formGroup.controls[item.key] as FormGroup;
  }

  getLabelLengthClass(tab: ParentDataItem): string {
    return getLongestFieldLabelClass(tab.items);
  }
}

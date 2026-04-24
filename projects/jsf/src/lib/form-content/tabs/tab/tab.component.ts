import { Component, input, model } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ParentDataItem } from '../../../models/parent-data-item';

@Component({
    selector: 'jsf-tab',
    standalone: true,
    templateUrl: './tab.component.html'
})
export class TabComponent {
  dataItem = input.required<ParentDataItem>();
  selected = model(false);
  formGroup = input.required<UntypedFormGroup>();
}

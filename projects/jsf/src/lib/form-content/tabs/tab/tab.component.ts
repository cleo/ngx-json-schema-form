import { Component, input, linkedSignal } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ParentDataItem } from '../../../models/parent-data-item';


@Component({
    selector: 'jsf-tab',
    standalone: true,
    templateUrl: './tab.component.html'
})
export class TabComponent {
  dataItem = input.required<ParentDataItem>();
  // eslint-disable-next-line @angular-eslint/no-input-rename
  selectedInput = input<boolean>(false, { alias: 'selected' });
  selected = linkedSignal(() => this.selectedInput());
  formGroup = input.required<UntypedFormGroup>();
}

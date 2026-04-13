import { Component, input, OnInit, signal } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ParentDataItem } from '../../../models/parent-data-item';


@Component({
    selector: 'jsf-tab',
    standalone: true,
    templateUrl: './tab.component.html'
})
export class TabComponent implements OnInit {
  dataItem = input.required<ParentDataItem>();
  // eslint-disable-next-line @angular-eslint/no-input-rename
  selectedInput = input<boolean>(false, { alias: 'selected' });
  selected = signal(false);
  formGroup = input.required<UntypedFormGroup>();

  ngOnInit(): void {
    this.selected.set(this.selectedInput());
  }
}

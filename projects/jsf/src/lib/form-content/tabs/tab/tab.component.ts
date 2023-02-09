import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ParentDataItem } from '../../../models/parent-data-item';

@Component({
  selector: 'jsf-tab',
  templateUrl: './tab.component.html'
})
export class TabComponent {
  @Input() dataItem: ParentDataItem;
  @Input() selected = false;
  @Input() formGroup: FormGroup;
}

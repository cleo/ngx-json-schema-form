import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ParentDataItem } from '../../../models/parent-data-item';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'jsf-tab',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tab.component.html',
})

export class TabComponent {
  @Input() dataItem: ParentDataItem;
  @Input() selected = false;
  @Input() formGroup: UntypedFormGroup;
}

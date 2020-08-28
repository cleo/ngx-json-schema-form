import { Component, ContentChild, Input } from '@angular/core';
import { ParentDataItem } from '../../../models/parent-data-item';
import { FormContentComponent } from '../../form-content.component';

@Component({
  selector: 'jsf-tab',
  templateUrl: './tab.component.html'
})
export class TabComponent {
  @ContentChild(FormContentComponent, { static: true}) public content: FormContentComponent;
  @Input() dataItem: ParentDataItem;
  @Input() selected = false;
}

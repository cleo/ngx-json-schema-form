import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { getLongestFieldLabelClass } from '../../form.service';
import { ParentDataItem } from '../../models/parent-data-item';
import { ContentBaseComponent } from '../content-base.component';

@Component({
  selector: 'jsf-section',
  templateUrl: 'section.component.html',
  styleUrls: ['../common.scss', 'section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent extends ContentBaseComponent implements OnInit {
  @Input() formItem: ParentDataItem;
  @Input() isContentShown = true;
  sectionLabelLengthClass: string;

  ngOnInit(): void {
    this.sectionLabelLengthClass = getLongestFieldLabelClass(this.formItem.items);
  }

  toggleContentShown(): void {
    this.isContentShown = !this.isContentShown;
  }
}

import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { noop } from 'rxjs';
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

  protected readonly noop = noop;

  ngOnInit(): void {
    this.sectionLabelLengthClass = getLongestFieldLabelClass(this.formItem.items);
  }

  toggleContentShown(): void {
    this.isContentShown = !this.isContentShown;
  }
}

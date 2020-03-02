import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { JSFConfig } from '../../jsf-config';
import { getLongestFieldLabelClass } from '../../jsf.service';
import { ParentDataItem } from '../../models/parent-data-item';

@Component({
  selector: 'jsf-section',
  templateUrl: 'section.component.html',
  styleUrls: ['../common.scss', 'section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent implements OnInit {
  @Input() formItem: ParentDataItem;
  @Input() formGroup: FormGroup;
  @Input() config: JSFConfig;
  isContentShown = true;
  sectionLabelLengthClass: string;

  ngOnInit(): void {
    this.sectionLabelLengthClass = getLongestFieldLabelClass(this.formItem.items);
  }

  toggleContentShown(): void {
    this.isContentShown = !this.isContentShown;
    this.formItem.disabledOnSubmit = !this.isContentShown;
  }
}

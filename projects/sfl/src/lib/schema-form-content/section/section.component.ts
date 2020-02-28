import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ParentDataItem } from '../../models/parent-data-item';
import { SFLConfig } from '../../sfl-config';
import { getLongestFieldLabelClass } from '../../sfl.service';

@Component({
  selector: 'sfl-section',
  templateUrl: 'section.component.html',
  styleUrls: ['../common.scss', 'section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent implements OnInit {
  @Input() formItem: ParentDataItem;
  @Input() formGroup: FormGroup;
  @Input() config: SFLConfig;
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

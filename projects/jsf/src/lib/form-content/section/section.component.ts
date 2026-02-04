import { ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';
import { noop } from 'rxjs';
import { getLongestFieldLabelClass } from '../../form.service';
import { ParentDataItem } from '../../models/parent-data-item';
import { ContentBaseComponent } from '../content-base.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'jsf-section',
    standalone: true,
    imports: [
      CommonModule
    ],
    templateUrl: 'section.component.html',
    styleUrls: ['../common.scss', 'section.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SectionComponent extends ContentBaseComponent implements OnInit {
  formItem = input.required<ParentDataItem>();
  isContentShownInput = input<boolean>(true, { alias: 'isContentShown' });
  isContentShown = signal(true);
  sectionLabelLengthClass: string;

  protected readonly noop = noop;

  ngOnInit(): void {
    this.sectionLabelLengthClass = getLongestFieldLabelClass(this.formItem().items);
    this.isContentShown.set(this.isContentShownInput());
  }

  toggleContentShown(): void {
    this.isContentShown.update(value => !value);
  }
}

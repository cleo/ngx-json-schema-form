import { Component, Input, OnInit } from '@angular/core';
import { EnumDataItem, OptionDisplayType } from '../../../models/enum-data-item';
import { FormDataItem, FormDataItemType } from '../../../models/form-data-item';

@Component({
  selector: 'sfl-label',
  templateUrl: './label.component.html',
  styleUrls: [ './label.component.scss']
})
export class LabelComponent implements OnInit {
  @Input() formItem: FormDataItem;
  @Input() labelLengthClass: string;
  isRadioButtonDisplay: boolean;
  showHelpAfterLabel: boolean;

  ngOnInit(): void {
    this.isRadioButtonDisplay = this.formItem.type === FormDataItemType.Enum && (this.formItem as EnumDataItem).display === OptionDisplayType.RADIO_BUTTONS;
    this.showHelpAfterLabel = this.formItem.type === FormDataItemType.Boolean || this.isRadioButtonDisplay;
  }

  getLabelClasses(): string {
    const classes = ['item-label'];

    if (Boolean(this.labelLengthClass)) {
      classes.push(this.labelLengthClass);
    }

    if (this.formItem.type === FormDataItemType.Boolean || this.isRadioButtonDisplay) {
      classes.push('full-width');
    }

    return classes.join(' ');
  }
}

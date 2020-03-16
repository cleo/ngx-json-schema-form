import { Component, Input } from '@angular/core';

import { OptionDisplayType } from '../../models/enum-data-item';
import { XOfDataItem } from '../../models/xOf-data-item';
import { ContentBaseComponent } from '../content-base.component';

@Component({
  selector: 'jsf-one-of',
  templateUrl: 'one-of.component.html'
})

export class OneOfComponent extends ContentBaseComponent {
  @Input() item: XOfDataItem;
  @Input() labelLengthClass: string;

  display: any = OptionDisplayType;
}

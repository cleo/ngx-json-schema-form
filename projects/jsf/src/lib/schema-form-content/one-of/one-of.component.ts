import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { JSFConfig } from '../../jsf-config';
import { OptionDisplayType } from '../../models/enum-data-item';
import { XOfDataItem } from '../../models/xOf-data-item';

@Component({
  selector: 'jsf-one-of',
  templateUrl: 'one-of.component.html'
})

export class OneOfComponent {
  @Input() item: XOfDataItem;
  @Input() formGroup: FormGroup;
  @Input() config: JSFConfig;
  @Input() labelLengthClass: string;

  enumDisplay: any = OptionDisplayType;
}

import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { OptionDisplayType } from '../../models/enum-data-item';
import { XOfDataItem } from '../../models/xOf-data-item';
import { SFLConfig } from '../../sfl-config';

@Component({
  selector: 'sfl-one-of',
  templateUrl: 'one-of.component.html'
})

export class OneOfComponent {
  @Input() item: XOfDataItem;
  @Input() formGroup: FormGroup;
  @Input() config: SFLConfig;
  @Input() labelLengthClass: string;

  enumDisplay: any = OptionDisplayType;
}

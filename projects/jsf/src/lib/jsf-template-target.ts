import { AbstractControl } from '@angular/forms';

export interface JSFTemplateTarget {
  path: string;
  formControl: AbstractControl;
  data: any;
}

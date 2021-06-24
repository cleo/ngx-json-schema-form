import { ButtonDataItem } from './button-data-item';
import { FormDataItem } from './form-data-item';
import { FormDataItemType } from './form-data-item';

export class TemplateDataItem extends FormDataItem {

  constructor(key: string,
              label: string,
              tooltip: string,
              helpText: string,
              required: boolean,
              pathParts: string[],
              type: FormDataItemType,
              value: any,
              isReadOnly: boolean,
              isHidden: boolean,
              public templateName: string,
              public targetPaths: string[]) {
    super(key, label, tooltip, helpText, required, pathParts, type, value, isReadOnly, isHidden);
  }
}

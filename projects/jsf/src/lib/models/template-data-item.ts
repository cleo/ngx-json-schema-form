import { FormDataItem } from './form-data-item';
import { FormDataItemType } from './form-data-item';

export class TemplateDataItem extends FormDataItem {
  public targetPaths: string[];
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
              targetPaths: string[],
              isStrongLabel?: boolean) {
    super(key, label, tooltip, helpText, required, pathParts, type, value, isReadOnly, isHidden, isStrongLabel);
    this.targetPaths = targetPaths && Array.isArray(targetPaths) && targetPaths.every(i => typeof i === 'string') ? targetPaths : [];
  }
}

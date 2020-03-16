import { Component, OnInit } from '@angular/core';
import { StringDataItem } from '../../../models/string-data-item';
import { FormControlBase } from '../form-control-base';

@Component({
  selector: 'jsf-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent extends FormControlBase implements OnInit {
  private rows: string;
  private cols: string;
  private isDefaultColsWidth = true;

  ngOnInit(): void {
    this.rows = this.getDisplayValue('rows');
    this.cols = this.getDisplayValue('cols');
    if (this.cols !== '') {
      this.isDefaultColsWidth = false;
    }
  }
  get stringDataItem(): StringDataItem {
    return this.formItem as StringDataItem;
  }

  /**
   * Gets the rows or cols based on the provided input
   * @returns # for row or cols
   *          empty if not found or error happened
   */
  getDisplayValue(key: string): string {
    const dispArea = this.stringDataItem.display;

    //remove textarea: from textarea:rows=#,cols=#
    const rowsCols = dispArea.replace('textarea:', '');
    const rowsColsArr = rowsCols.split(',');
    if (rowsColsArr.length === 2) {
      let i = 0;
      for (i; i < rowsColsArr.length; i++) {
        if (rowsColsArr[i].startsWith(key)) {
          return rowsColsArr[i].replace(`${key}=`, '');
        }
      }
    }
    return '';
  }
}

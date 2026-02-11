import { Component, computed, input } from "@angular/core";
import {
  EnumDataItem,
  OptionDisplayType,
} from "../../../models/enum-data-item";
import { FormDataItem, FormDataItemType } from "../../../models/form-data-item";

@Component({
  selector: "jsf-label",
  standalone: true,
  imports: [],
  templateUrl: "./label.component.html",
  styleUrls: ["./label.component.scss"],
})
export class LabelComponent {
  formItem = input.required<FormDataItem>();
  labelLengthClass = input<string>("");

  get isRadioButtonDisplay(): boolean {
    const item = this.formItem();
    return (
      item?.type === FormDataItemType.Enum &&
      (item as EnumDataItem).display === OptionDisplayType.RADIO_BUTTONS
    );
  }

  get showHelpAfterLabel(): boolean {
    const item = this.formItem();
    return item?.type === FormDataItemType.Boolean || this.isRadioButtonDisplay;
  }

  getLabelClasses(): string {
    const classes = ["item-label"];
    const lengthClass = this.labelLengthClass();

    if (Boolean(lengthClass)) {
      classes.push(lengthClass);
    }

    const item = this.formItem();
    if (item?.type === FormDataItemType.Boolean || this.isRadioButtonDisplay) {
      classes.push("full-width");
    }

    return classes.join(" ");
  }

  isRequired(): boolean {
    const item = this.formItem();
    return item?.required || item?.type === FormDataItemType.Enum;
  }

  getClassLabel(): string[] {
    const classes = ["header"];
    const item = this.formItem();
    if (item?.isStrongLabel) {
      return classes;
    }
    return [];
  }
}

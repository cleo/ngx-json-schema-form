import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { NEVER } from 'rxjs';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { ComponentLifeCycle, getInputValue$ } from './component-life-cycle';
import { FormContentComponent } from './form-content/form-content.component';
import { FormDataItemService } from './form-data-item.service';
import { FormService, getLongestFieldLabelClass } from './form.service';
import { JSFConfig } from './jsf-config';
import { JSFEventButton } from './jsf-event-button';
import { JSFEventButtonTarget } from './jsf-event-button-target';
import { JSFSchemaData } from './jsf-schema-data';
import { JSFTemplateEvent } from './jsf-template-event';
import { JSFTemplateTarget } from './jsf-template-target';
import { FormDataItem } from './models/form-data-item';
import { ParentDataItem } from './models/parent-data-item';
import { XOfEnumDataItem } from './models/xOf-enum-data-item';

@Component({
  selector: 'jsf-component',
  templateUrl: './jsf.component.html',
  styleUrls: ['./jsf.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JSFComponent extends ComponentLifeCycle implements AfterViewInit, OnInit {
  @ViewChild(FormContentComponent, {static: true}) content: FormContentComponent;
  @ViewChild('formRoot', {static: true}) formElement: ElementRef<HTMLFormElement>;
  @Input() config: JSFConfig;
  @Input() schemaData;
  @Input() templates: any = {};
  @Output() disableSubmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() formHeightChange: EventEmitter<number> = new EventEmitter();
  @Output() buttonEvent: EventEmitter<JSFEventButton> = new EventEmitter();
  @Output() templateEvent: EventEmitter<JSFTemplateEvent> = new EventEmitter();

  formDataItems: FormDataItem[] = [];
  formGroup: UntypedFormGroup = new UntypedFormGroup({});
  isEdit = false;
  sectionLabelLengthClass: string;

  constructor(private formService: FormService, private dataItemService: FormDataItemService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    getInputValue$(this, 'schemaData').pipe(
      switchMap((data: JSFSchemaData) => {
        if (!data || !data.schema) {
          return NEVER;
        }
        this.isEdit = this.dataItemService.isFormInEditMode(data);
        this.formDataItems = this.dataItemService.getFormDataItems(data);
        this.formGroup = this.formService.getForm(new UntypedFormGroup({}), this.formDataItems);
        this.sectionLabelLengthClass = getLongestFieldLabelClass(this.formDataItems);

        if (this.isEdit && this.formGroup.valid) {
          this.disableSubmit.next(false);
        }

        return this.formGroup.statusChanges.pipe(
          tap(status => {
            if (status === 'INVALID' || status === 'DISABLED') {
              this.disableSubmit.next(true);
            } else {
              this.disableSubmit.next(false);
            }
          })
        );
      }),
      takeUntil(this.ngDestroy$)).subscribe();
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.content.divs.changes
      .pipe(take(1))
      .subscribe(() => this.formHeightChange.emit(this.getFormHeight()));
  }

  onFormElementChange(): void {
    setTimeout(() => {
      this.formHeightChange.emit(this.getFormHeight());
    });
  }

  private getFormHeight(): number {
    const FORM_TOP_PADDING = 10;
    const FORM_BOTTOM_PADDING = 10;
    const FORM_TOP_MARGIN = 19;
    const FORM_BOTTOM_MARGIN = 19;
    const SECTION_TOP_MARGIN = 10;
    const SECTION_BOTTOM_MARGIN = 25;

    const ERROR_BUFFER_HEIGHT = 60;
    const SECTION_TOTAL_MARGIN = SECTION_TOP_MARGIN + SECTION_BOTTOM_MARGIN;
    const FORM_PADDING_AND_MARGIN =
      FORM_TOP_MARGIN +
      FORM_BOTTOM_MARGIN +
      FORM_TOP_PADDING +
      FORM_BOTTOM_PADDING;

    return this.content.divs
        .map((div: ElementRef<HTMLDivElement>) => div.nativeElement.clientHeight)
        .reduce((total, num) => total + num, 0) +
      FORM_PADDING_AND_MARGIN +
      (SECTION_TOTAL_MARGIN * (this.content.divs.length - 1))  // all but the first section has a top margin and all but the last has a bottom margin
      + ERROR_BUFFER_HEIGHT;
  }

  getFormValues(): any {
    const formValues = this.formService.getFormValues(this.formGroup, this.formDataItems);

    const flattenedItems = this.flattenDataItems(this.formDataItems);
    const xOfEnumKeys = flattenedItems.filter(item => {
      if (item instanceof XOfEnumDataItem) {
        return true;
      }
      return false;
    }).map(item => item.key);
    this.removeXOfEnumValues(xOfEnumKeys, formValues);
    return formValues;
  }

  private removeXOfEnumValues(xOfEnumKeys: string[], values: any): void {
    Object.keys(values).forEach(key => {
      if (xOfEnumKeys.some(enumKey => enumKey === key)) {
        const enumValue = Object.keys(values[key])[0];
        values[key] = values[key][enumValue];
      }
      if (typeof values[key] === 'object' && Object.keys(values[key])) {
        this.removeXOfEnumValues(xOfEnumKeys, values[key]);
      }
    });
  }

  private flattenDataItems(items: FormDataItem[]): FormDataItem[] {
    const flattenedObject = [];

    function recursiveFlattening(cur: any) {
      if (Array.isArray(cur)) {
        const l = cur.length;
        for (let i = 0; i < l; i++) {
          recursiveFlattening(cur[i]);
        }
      } else if (!cur.items) {
        flattenedObject.push(cur);
      } else {
        for (const p of Object.keys(cur.items)) {
          recursiveFlattening(cur.items[p]);
        }
      }
    }

    recursiveFlattening(items);
    return flattenedObject;
  }

  /**
   * This method takes in information from a button event, finds all of the form values
   * from the provided target paths, and emits an event to the parent project of the JSF.
   * The data that is emitted will contain a path and the target forms values.
   *
   * These form values will possibly be mutated by the parent project and
   * can act as scaffolding for when the data is passed back into the project.
   *
   * Note: if a targetPath cannot be found, it will not be returned in emitted event
   *
   * @param {{key: string; targetPaths: string[]}} event - an event that indicates a button
   *                    has been clicked. This contains an array of multiple target paths.
   */
  onButtonEvent(event: { key: string; targetPaths: string[] }): void {
    const targets: JSFEventButtonTarget[] = event.targetPaths.map(path => {
      const targetPath = path.split('.');
      const control = this.formService.findAbstractControl(targetPath, this.formGroup);
      const dataItem = this.dataItemService.findFormDataItem(targetPath, this.formDataItems);

      if (dataItem && control) {
        const items = dataItem instanceof ParentDataItem ? (dataItem as ParentDataItem).items : [dataItem];
        const result = this.formService.getFormValues(control, items);
        return { path: path, data: result };
      }
    }).filter(value => !!value);
    this.buttonEvent.next({ key: event.key, targets: targets });
  }

  onTemplateEvent(event: { key: string; targetPaths: string[] }): void {
    const targets: JSFTemplateTarget[] = event.targetPaths.map(path => {
      const targetPath = path.split('.');
      const control = this.formService.findAbstractControl(targetPath, this.formGroup);
      const dataItem = this.dataItemService.findFormDataItem(targetPath, this.formDataItems);

      if (dataItem && control) {
        const items = dataItem instanceof ParentDataItem ? (dataItem as ParentDataItem).items : [dataItem];
        const result = this.formService.getFormValues(control, items);
        return { path: path, formControl: control, data: result };
      }
    }).filter(value => !!value);
    this.templateEvent.next({ key: event.key, targetPaths: targets });
  }

  onManualFormChangeEvent(): void {
    this.onFormElementChange();
  }

}

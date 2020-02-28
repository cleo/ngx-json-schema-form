import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

import { NEVER } from 'rxjs';
import { switchMap, take } from 'rxjs/internal/operators';
import { takeUntil, tap } from 'rxjs/operators';

import { ComponentLifeCycle, getInputValue$ } from './ComponentLifeCycle';
import { FormDataItem, FormDataItemType } from './models/form-data-item';
import { ParentDataItem } from './models/parent-data-item';
import { SchemaFormContentComponent } from './schema-form-content/sfl-content.component';
import { SFLConfig } from './sfl-config';
import { SFLService } from './sfl.service';

@Component({
  selector: 'sfl-component',
  templateUrl: './sfl.component.html',
  styleUrls: [ './sfl.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SFLComponent extends ComponentLifeCycle implements AfterViewInit, OnInit {
  @ViewChild(SchemaFormContentComponent, { static: true }) content: SchemaFormContentComponent;
  @ViewChild('schemaForm', { static: true }) formElement: ElementRef<HTMLFormElement>;
  @Input() config: SFLConfig;
  @Input() formDataItems;
  @Output() disableSubmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() formHeightChange: EventEmitter<number> = new EventEmitter();

  formItems: FormDataItem[] = [];
  form: FormGroup = new FormGroup({});

  constructor(private sfs: SFLService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    getInputValue$(this, 'formDataItems').pipe(
      switchMap((items: FormDataItem[]) => {
        if (!items) {
          return NEVER;
        }

        this.formItems = items;
        this.form = this.sfs.getForm(new FormGroup({}), this.formItems);

        if (this.config.isEdit && this.form.valid) {
          this.disableSubmit.next(false);
        }

        return this.form.statusChanges.pipe(
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

  enableDisableUnchangedSecuredStringControls(abstractControl: FormGroup, items: FormDataItem[], shouldDisable: boolean): void {
    items.forEach(item => {
      const formControl = abstractControl.controls[item.key];
      if (!!formControl) { // formControl may not always be present due to xOfs and conditional controls
        switch (item.type) {
          case FormDataItemType.Object:
          case FormDataItemType.xOf:
            if (item.disabledOnSubmit) {
              this.toggleEnableDisable(formControl, shouldDisable);
            } else {
              const parentItem = item as ParentDataItem;
              this.enableDisableUnchangedSecuredStringControls(formControl as FormGroup, parentItem.items, shouldDisable);
            }
            break;
          case FormDataItemType.Enum:
          case FormDataItemType.String:
            if (item.disabledOnSubmit) {
              this.toggleEnableDisable(formControl, shouldDisable);
            }
            break;
        }
      }
    });
  }

  toggleEnableDisable(abstractControl: AbstractControl, shouldDisable: boolean): void {
    if (shouldDisable) {
      abstractControl.disable();
      } else {
      abstractControl.enable();
    }
  }

  getFormValues(): any {
    this.enableDisableUnchangedSecuredStringControls(this.form, this.formItems, true);
    const result = this.form.value;
    this.enableDisableUnchangedSecuredStringControls(this.form, this.formItems, false);
    return result;
  }
}

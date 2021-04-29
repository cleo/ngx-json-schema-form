import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { take, takeUntil, tap } from 'rxjs/operators';
import { ContentBaseComponent } from '../../../content-base.component';
import { ModalService } from './modal.service';

@Component({
  selector: 'jsf-modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent extends ContentBaseComponent implements AfterViewInit {
  @ViewChild('modal', { static: true }) modalEl: ElementRef;

  shouldHaveFadeInClass = false;

  @Output() closeInput: EventEmitter<any> = new EventEmitter();

  constructor(
    private modalService: ModalService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.shouldHaveFadeInClass = true;

      this.changeDetectorRef.markForCheck();
    });

    this.modalService.getCloseEvents().pipe(
      take(1),
      tap(() => this.shouldHaveFadeInClass = false),
      takeUntil(this.ngDestroy$)
    ).subscribe();

    this.modalEl.nativeElement.focus();
  }

  onClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  onOutsideClick(event: MouseEvent): void {
    event.stopPropagation();

    this.closeInput.emit();
  }

  onEscapeKeyDown(event: KeyboardEvent): void {
    event.stopPropagation();

    this.closeInput.emit();
  }
}

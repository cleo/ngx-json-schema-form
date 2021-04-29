import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
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
  @ViewChild('modalContent', { static: true }) modalContentEl: ElementRef;

  @Output() closeInput: EventEmitter<any> = new EventEmitter();
  @Output() resizeInput: EventEmitter<any> = new EventEmitter();

  shouldHaveFadeInClass = false;

  width: number;
  minWidth: number;
  left = 0;
  previousLeft = 0;
  top = 0;
  previousTop = 0;
  height: number;
  minHeight: number;
  draggingCorner = false;
  draggingWindow = false;

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

    this.width = this.modalContentEl.nativeElement.offsetWidth;
    this.height = this.modalContentEl.nativeElement.offsetHeight;
    this.minWidth = this.modalContentEl.nativeElement.offsetWidth;
    this.minHeight = this.modalContentEl.nativeElement.offsetHeight;
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

  onWindowPress(event: MouseEvent) {
    this.draggingWindow = true;
    this.previousLeft = event.clientX;
    this.previousTop = event.clientY;
  }

  onWindowDrag(event: MouseEvent) {
    if (!this.draggingWindow) {
      return;
    }

    const offsetX = event.clientX - this.previousLeft;
    const offsetY = event.clientY - this.previousTop;

    this.left += offsetX;
    this.top += offsetY;
    this.previousLeft = event.clientX;
    this.previousTop = event.clientY;
  }

  resize(offsetX: number, offsetY: number) {
    this.width += offsetX;
    this.height += offsetY;

    if (this.width < this.minWidth) {
      this.width = this.minWidth;
    }

    if (this.height < this.minHeight) {
      this.height = this.minHeight;
    }
    this.resizeInput.emit();
  }

  onCornerClick(event: MouseEvent) {
    this.draggingCorner = true;
    this.previousLeft = event.clientX;
    this.previousTop = event.clientY;
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('document:mousemove', ['$event'])
  onCornerMove(event: MouseEvent) {
    if (!this.draggingCorner) {
      return;
    }

    const offsetX = event.clientX - this.previousLeft;
    const offsetY = event.clientY - this.previousTop;

    this.resize(offsetX, offsetY);
    this.previousLeft = event.clientX;
    this.previousTop = event.clientY;
  }

  @HostListener('document:mouseup', ['$event'])
  onCornerRelease(event: MouseEvent) {
    this.draggingWindow = false;
    this.draggingCorner = false;
  }
}

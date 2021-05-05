import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { EMPTY, Observable, Subject, timer } from 'rxjs';
import { switchAll, takeUntil, tap } from 'rxjs/operators';
import { ComponentLifeCycle } from '../../../../component-life-cycle';
import { AlertService, IAlert } from './alert.service';

const AUTO_HIDE_DELAY = 3000;
const SECONDARY_AUTO_HIDE_DELAY = 2000;

@Component({
  selector: 'jsf-alert',
  template: `
    <div class="alert alert-success"
         [ngClass]="{'active': active}"
         (mouseenter)="onMouseEnter()"
         (mouseleave)="onMouseLeave()">
      <img title="Success"
           [src]="'assets/jsf-images/success.svg'"
           alt="Success"
           class="alert-success-icon"
           (click)="onCloseClick()">
      <span class="alert-message pull-left">{{message}}</span>
      <img title="Click to close this alert"
           [src]="'assets/jsf-images/close.svg'"
           alt="Click to close this alert"
           class="alert-close"
           (click)="onCloseClick()">
    </div>
  `,
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent extends ComponentLifeCycle implements OnInit {
  @Input() alertStream: AlertService;
  private autoHide$: Subject<Observable<any>> = new Subject();
  @HostBinding('class.active') active = false;
  message: string | undefined;

  ngOnInit(): void {
    this.autoHide$.pipe(
      switchAll(), // keep last auto-hide only
      tap(() => this.hide())
    ).subscribe();

    this.alertStream.getAlerts().pipe(
      takeUntil(this.ngDestroy$),
      tap(alert => {
        if (alert) {
          this.show(alert);
        } else {
          this.hide();
        }
      })
    ).subscribe();
  }

  private show(alert: IAlert): void {
    this.cancelAutoHide();

    this.active = true;
    this.message = alert.message;
    this.scheduleAutoHide(AUTO_HIDE_DELAY);
  }

  private hide(): void {
    this.cancelAutoHide();
    this.active = false;
  }

  private scheduleAutoHide(delay: number): void {
    this.autoHide$.next(timer(delay));
  }

  private cancelAutoHide(): void {
    this.autoHide$.next(EMPTY);
  }

  onMouseEnter(): void {
    this.cancelAutoHide();
  }

  onMouseLeave(): void {
    if (this.active) {
      this.scheduleAutoHide(SECONDARY_AUTO_HIDE_DELAY);
    }
  }

  onCloseClick(): void {
    this.hide();
  }
}

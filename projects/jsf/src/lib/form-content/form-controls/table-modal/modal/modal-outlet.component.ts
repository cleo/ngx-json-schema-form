import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnInit, Type, ViewContainerRef } from '@angular/core';

import { merge, Observable, of, timer } from 'rxjs';
import { delay, map, switchAll, takeUntil, tap } from 'rxjs/operators';
import { ComponentLifeCycle } from '../../../../component-life-cycle';

import { MODAL_OPTIONS_TOKEN, ModalService } from './modal.service';

@Component({
  selector: 'jsf-modal-outlet',
  template: `<ng-container *ngComponentOutlet="componentType; injector: componentInjector"></ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalOutletComponent extends ComponentLifeCycle implements OnInit {
  private readonly fadeOutDuration = 300;

  componentType: Type<any>;
  componentInjector: Injector;

  @Input() modalService: ModalService;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
  }

  ngOnInit(): void {
    merge(
      this.modalService.getOpenEvents().pipe(map(options => this.open(options))),
      this.modalService.getCloseEvents().pipe(map(() => this.close()))
    ).pipe(
      switchAll(),
      takeUntil(this.ngDestroy$)
    ).subscribe();
  }

  private open(options: any): Observable<any> {
    return of(undefined).pipe(
      tap(() => {
        this.componentType = undefined; // clear any existing modal

        this.changeDetectorRef.markForCheck();
      }),
      delay(0), // wait for change detection
      tap(() => {
        const modalService = this.modalService;

        this.componentInjector = Injector.create({
          providers: [
            { provide: ModalService, useFactory: () => modalService, deps: [] },
            { provide: MODAL_OPTIONS_TOKEN, useFactory: () => options, deps: [] }
          ],
          parent: this.viewContainerRef.injector
        });

        this.componentType = this.modalService.getComponentType();

        this.changeDetectorRef.markForCheck();
      })
    );
  }

  private close(): Observable<any> {
    return timer(this.fadeOutDuration).pipe(
      tap(() => {
        this.componentType = undefined;

        this.changeDetectorRef.markForCheck();
      })
    );
  }
}

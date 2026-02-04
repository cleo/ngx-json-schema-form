import { AfterContentInit, AfterViewInit, OnDestroy, OnInit, Directive } from '@angular/core';

import { Subject } from 'rxjs';

@Directive()
export class ComponentLifeCycle implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {
  ngInit$: Subject<any> = new Subject<any>();
  ngAfterViewInit$ = new Subject<void>();
  ngAfterContentInit$ = new Subject<void>();
  ngDestroy$: Subject<any> = new Subject<any>();
  isComponentReady = false;

  ngOnInit(): void {
    this.isComponentReady = true;
    this.ngInit$.next({});
    this.ngInit$.complete();
  }

  ngAfterContentInit(): void {
    this.ngAfterContentInit$.next();
    this.ngAfterContentInit$.complete();
  }

  ngAfterViewInit(): void {
    this.ngAfterViewInit$.next();
    this.ngAfterContentInit$.complete();
  }

  ngOnDestroy(): void {
    this.ngDestroy$.next({});
    this.ngDestroy$.complete();
  }
}

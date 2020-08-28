import { AfterContentInit, AfterViewInit, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core';

import { Observable ,  Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';

export class ComponentLifeCycle implements OnInit, AfterContentInit, AfterViewInit, OnChanges, OnDestroy {
  ngInit$: Subject<any> = new Subject<any>();
  ngAfterViewInit$ = new Subject<void>();
  ngAfterContentInit$ = new Subject<void>();
  ngChanges$: Subject<SimpleChanges> = new Subject<SimpleChanges>();
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

  ngOnChanges(changes: SimpleChanges): void {
    this.ngChanges$.next(changes);
  }

  ngOnDestroy(): void {
    this.ngDestroy$.next({});
    this.ngDestroy$.complete();
    this.ngChanges$.complete();
  }

  getInputValue$<T extends ComponentLifeCycle, R = any>(property: keyof T): Observable<R> {
    return getInputValue$(this, <any>property);
  }
}

export const getInputValue$ = <T extends ComponentLifeCycle, K extends keyof T>(obj: T, property: K, ignoreUndefined = true): Observable<T[K]> =>
  obj.ngChanges$.pipe(
    map((changes: SimpleChanges) => changes[<string> property]),
    filter(change => change !== undefined),
    map((change: SimpleChange) => change.currentValue),
    startWith(obj[property.toString()]),
    distinctUntilChanged(),
    filter(ignoreUndefined ? (change) => change !== undefined : () => true)
  );

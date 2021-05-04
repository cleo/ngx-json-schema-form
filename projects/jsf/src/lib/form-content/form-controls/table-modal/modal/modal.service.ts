import { InjectionToken, Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

export class ModalService<TOptions = undefined, TResult = undefined> {
  private modalOpen = false;

  private openEvents$ = new Subject<TOptions>();
  private closeEvents$ = new Subject<TResult>();

  constructor(private componentType: Type<any>) {}

  getComponentType(): Type<any> {
    return this.componentType;
  }

  open(options?: TOptions): Observable<TResult> {
    const result$ = this.closeEvents$.pipe(take(1));

    this.modalOpen = true;

    this.openEvents$.next(options);

    return result$;
  }

  close(result?: TResult): void {
    this.modalOpen = false;
    this.closeEvents$.next(result);
  }

  isOpen(): boolean {
    return this.modalOpen;
  }

  getOpenEvents(): Observable<TOptions> {
    return this.openEvents$.asObservable();
  }

  getCloseEvents(): Observable<TResult> {
    return this.closeEvents$.asObservable();
  }
}

export const MODAL_OPTIONS_TOKEN = new InjectionToken<any>('ModalOptions');

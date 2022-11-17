import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

export interface IAlert {
  message: string;
}

@Injectable()
export class AlertService {
  private alert$: ReplaySubject<IAlert> = new ReplaySubject<IAlert>(1);
  private alert: IAlert = null;

  show(message: string): void {
    this.alert = { message };
    this.alert$.next(this.alert);
  }

  /**
   * Clears the alert message so that it will hide.
   */
  hide(): void {
    this.alert = null;
    this.alert$.next(this.alert);
  }

  getAlerts(): Observable<IAlert> {
    return this.alert$.asObservable();
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonDataItem } from '../../../models/button-data-item';

@Component({
             selector: 'jsf-event-button',
             templateUrl: './event-button.component.html',
             styleUrls: ['./event-button.component.scss']
           })
export class EventButtonComponent {
  @Input() buttonData: ButtonDataItem;
  @Output() buttonEvent: EventEmitter<{ key: string; targetPaths: string[] }> = new EventEmitter();

  onClick(): void {
    this.buttonEvent.next({ key: this.buttonData.key, targetPaths: this.buttonData.targetPaths });
  }
}

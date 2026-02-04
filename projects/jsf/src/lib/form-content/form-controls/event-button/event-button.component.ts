import { Component, input, output } from '@angular/core';
import { ButtonDataItem } from '../../../models/button-data-item';


@Component({
    selector: 'jsf-event-button',
    standalone: true,
    imports: [],
    templateUrl: './event-button.component.html',
    styleUrls: ['./event-button.component.scss']
})

export class EventButtonComponent {
  buttonData = input.required<ButtonDataItem>();
  buttonEvent = output<{ key: string; targetPaths: string[] }>();

  onClick(): void {
    this.buttonEvent.emit({ key: this.buttonData().key, targetPaths: this.buttonData().targetPaths });
  }
}

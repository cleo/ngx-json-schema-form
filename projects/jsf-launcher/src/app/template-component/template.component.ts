import { Component } from '@angular/core';
import { TemplateEvent } from '../app.component';

@Component({
  selector: 'app-template-test',
  templateUrl: 'template.component.html'
})
export class TemplateComponent {

  templateInput1 = '';
  templateInput2 = '';
  timesButtonClicked = 0;

  public setValuesInJSF(event: TemplateEvent): void {
    // console.log('Received Event: ', event);
    for (let i = 0; i < event.targetPaths.length; i++) {
      const target = event.targetPaths[i];
      if (target.path.endsWith('templateValue')) {
        target.formControl.setValue(this.templateInput1);
      }
      if (target.path.endsWith('templateVisibleValue')) {
        target.formControl.setValue(this.templateInput2);
      }
      if (target.path.endsWith('timesButtonClicked')) {
        target.formControl.setValue(this.timesButtonClicked);
      }
    }
  }

  onClick() {
    this.timesButtonClicked ++;
  }

}

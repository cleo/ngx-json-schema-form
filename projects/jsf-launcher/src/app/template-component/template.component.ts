import { Component, OnInit } from '@angular/core';
import { TemplateEvent } from '../app.component';

@Component({
  selector: 'app-template-test',
  templateUrl: 'template.component.html'
})
export class TemplateComponent {

  templateInput1 = '';
  templateInput2 = '';

  public setValuesInJSF(event: TemplateEvent): void {
    console.log('in templateEvent in component: \n', event);
    for (let i = 0; i < event.targetPaths.length; i++) {
      let target = event.targetPaths[i];
      if (target.path.endsWith('templateValue')) {
        target.formControl.setValue(this.templateInput1);
      }
      if (target.path.endsWith('templateVisibleValue')) {
        target.formControl.setValue(this.templateInput2);
      }
    }
  }

  onClick() {
    // Get the JSF property values so that we can send them
  }

}

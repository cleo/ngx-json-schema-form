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

  private initValues = true;

  public doJsfEvent(event: TemplateEvent): void {
    if (this.initValues) {

      for (let i = 0; i < event.targetPaths.length; i++) {
        const target = event.targetPaths[i];
        if (target.path.endsWith('templateValue')) {
          this.templateInput1 = target.data;
        }
        if (target.path.endsWith('templateVisibleValue')) {
          this.templateInput2 = target.data;
        }
        if (target.path.endsWith('timesButtonClicked')) {
          this.timesButtonClicked = target.data;
        }
      }
      this.initValues = false;
    } else {
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
  }

  onClick() {
    this.timesButtonClicked ++;
  }

}

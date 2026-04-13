# JSON Schema Form

This project is a [JSON Schema 7](http://json-schema.org) form builder for Angular 20+. This project contains the front end code that consumes JSON Schema 
and generates a user friendly form that can be used in a web interface.

This code needs to work in tandem with the back end [JSON Schema Form Validation](https://www.npmjs.com/package/@cleo/ngx-json-schema-form-validation) package.

### Getting Started
(1) Install the library in your project

```
npm install @cleo/ngx-json-schema-form
```

(2) Import `JSFComponent` directly into your standalone component.
```typescript
import { Component, ViewChild, signal } from '@angular/core';

@Component({
  selector: 'example',
  standalone: true,
  imports: [JSFComponent],
  templateUrl: 'example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent { }
```

(3) Configure your Angular component to use the JSON Schema Form. Reference the example below as well as a detailed list below of the necessary steps.
   - Create a `JSFConfig` object to control the commonly used configuration items:
      - If sections are collapsible
      - If there are dividers between sections
      - If outer sections are expanded by default
   - Create a `JSFSchemaData` object by passing your JSON Schema 7 object and a corresponding values object. The component will internally transform these into its data model.
   - Create a Submit button in your component. Listen to the `disableSubmit` event emitted from the JSON Schema Form and disable your submit button.
   - Create a `ViewChild` property to reference your `JSFComponent`. Use it to retrieve submitted form values by calling `this.schemaFormComponent.getFormValues()`.
   - [Optional] Listen to the `formHeightChange` event emitted from the JSON Schema Form.

```typescript
import { Component, ViewChild, signal } from '@angular/core';
import { JSFComponent, JSFConfig, JSFSchemaData } from '@cleo/ngx-json-schema-form';

@Component({
  selector: 'example',
  standalone: true,
  imports: [JSFComponent],
  templateUrl: 'example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent {
  @ViewChild(JSFComponent, { static: false }) schemaFormComponent!: JSFComponent;
  readonly config: JSFConfig = {
    enableCollapsibleSections: false,
    showSectionDivider: true,
    expandOuterSectionsByDefault: true,
  };
  readonly isSubmitDisabled = signal<boolean>(true);
  readonly schemaData = signal<JSFSchemaData>(new JSFSchemaData(schema, values));

  // this event allows you to enable/disable the submit button in the parent container
  onDisableSubmit(disableSubmit: boolean): void {
    this.isSubmitDisabled.set(disableSubmit);
  }

  // this event allows you to modify parent container height to match the height of the form
  onFormHeightChange(formHeight: number): void { }

  getJSFFormValues(): void {
    const jsonData = this.schemaFormComponent.getFormValues();
  }
}
```

(4) Import the JSFComponent into your template. See example below.

``` HTML
  <jsf-component
   [schemaData]="schemaData()"
   [config]="config"
   (disableSubmit)="onDisableSubmit($event)"
   (formHeightChange)="onFormHeightChange($event)">
  </jsf-component>
```

_Note: be sure to only pass in a valid JSON schema object. If you don't already have your own schemas, you can use a preconfigured schema `projects/jsf-launcher/src/app/schemaV2.json` to test with._

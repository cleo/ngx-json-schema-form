# JSON Schema Form

This library contains two sets of code:
1. Front end code that consumes JSON 7 Schema and generates a user friendly form that can be used in a web interface
2. Back end code containing a custom validator that is used to validate that the values returned match the schema rules.

When using the JSON Schema Form in a project, the front end and backend projects need to install the same version of the JSON Schema Form via node.

_See our wiki on how to configure JSON 7 Schema into a visual form._

## Getting Started

### Local Development

1. Install [Node.js 22.15.0](https://nodejs.org/download/release/v22.15.0/)

2. Install project dependencies
```
npm install
```

3. Run it
```
cd .\projects\jsf-launcher\
npm run serve
```

4. Open [localhost:4200](http://localhost:4200)

#### Running the Tests

To run the unit tests locally, run the following command:
```
npm run test
```

To run the validation tests for the backend project, run:
```
npm run test-validation
```

### Front End Project Development
#### Prerequisites

1. To use the front end functionality of this library, your project must use:
   - Angular
   - [Node.js](https://nodejs.org/en/download/)

2. Install the JSON Schema Form into your project

3. Install icons into your front end Angular project
   1. Open your project's angular.json file. Find the `"assets"` key. Pick a directory to store these images (ex: `./src/assets`).
   2. Copy the directory `./projects/jsf-launcher/src/assets/jsf-images` into your project's assets directory.

#### UI Component Configuration
1. Import the JSFComponent into your project.
```
import { Component, ViewChild, signal } from '@angular/core';
import { JSFComponent } from '@cleo/ngx-json-schema-form';

@Component({
  selector: 'example',
  standalone: true,
  imports: [JSFComponent],
  templateUrl: 'example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent { }
```

2. Configure your Angular component to use the JSON Schema Form. Reference the example below as well as a detailed list below of the necessary steps.
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

3. Import the JSFComponent into your template. See example below.

``` HTML
  <jsf-component
   [schemaData]="schemaData()"
   [config]="config"
   (disableSubmit)="onDisableSubmit($event)"
   (formHeightChange)="onFormHeightChange($event)">
  </jsf-component>
```

### Back End Project Development
#### Prerequisites
1. To use the back end functionality of this library, it is recommended your project use:
   - [Node.js](https://nodejs.org/en/download/)

2. Install JSON Schema Form Validation

3. You will then have access to the following validation classes:
   - RequiredSchemaValueValidationService
   - SecuredSchemaValueValidationService
   - SchemaHelperService

## Versioning

For the versions available, see the [tags on this repository](https://github.com/cleo/ngx-json-schema-form/releases).

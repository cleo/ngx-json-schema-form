# JSON Schema Form

This library contains two sets of code:
1. Front end code that consumes JSON 7 Schema and generates a user friendly form that can be used in a web interface
2. Back end code containing a custom validator that is used to validate that the values returned match the schema rules. 

When using the JSON Schema Form in a project, the front end and backend projects need to install the same version of the JSON Schema Form via node.

_See our wiki on how to configure JSON 7 Schema into a visual form._

## Getting Started

### Local Development

1. Install [Node.js](https://nodejs.org/en/download/)

2. Install project dependencies
```
npm install
```

3. Run it
```
cd .\projects\sfl-launcher\
npm run serve
```

4. Open [localhost:4200](http://localhost:4200)

#### Running the Tests

To run the unit tests locally, run the following command:
```
npm run test
```

### Front End Project Development
#### Prerequisites

1. To use the front end functionality of this library, your project must use:
   - Angular
   - [Node.js](https://nodejs.org/en/download/)

2. Install the JSON Schema Form into your project

3. Install icons into your front end Angular project
   1. Open your project's angular.json file. Find the `"assets"` key. Pick a directory to store these images (ex: `./src/assets`).
   2. Copy the directory `./projects/sfl-launcher/src/assets/sfl-images` into your project's assets directory.

#### UI Component Configuration
1. Import the SFLModule into your project.
```
@NgModule({
  declarations: [],
  exports: [],
  imports: [
    SFLModule
  ],
  providers: []
})
export class ExampleModule { }
```

2. Configure your Angular component to use the JSON Schema Form. Reference the example below as well as a detailed list below of the necessary steps.
   - Create a SFLConfig object to control the commonly used confguration items:
      - If this is an edit case
      - If sections are collapsible
      - If there are dividers between sections
   - Inject the SFLDataItemService into your constructor and use the `getFormDataItems()` method to transform the JSON 7 schema and corresponding values into an array of FormDataItems. FormDataItems are the data model that the SFL understands and uses to generate the angular forms.
   - Create a Submit button in your component. Listen to the `disableSubmit` event emitted from the JSON Schema Form and disable your submit button.
   - Create a ViewChild property in your component to reference your SFLComponent. Use this property to get the submitted form values by calling `this.schemaFormComponent.getFormValues();`
   - [Optional] Listen to the `formHeightChange` event emitted from the JSON Schema Form.
   
```
@Component({
  selector: 'example',
  templateUrl: 'example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent {
  @ViewChild(SFLComponent, { static: false }) schemaFormComponent: SFLComponent;
  config = new SFLConfig(false, false, true);
  formDataItems: FormDataItem[];
    isSubmitDisabled = true;
  
  constructor(private sflDataItemService: SFLDataItemService) {
    // grab schema and values from some service
    this.formDataItems = this.formDataItemService.getFormDataItems(schema, values, this.config.isEdit);
  }

  // this event allows you to enable/disable the submit button in the parent container
  onDisableSubmit(disableSubmit: boolean): void {
    this.isSubmitDisabled = disableSubmit;
  }
  
  // this event allows you to modify parent container height to match the height of the form
  onFormHeightChange(formHeight: number): void { }
  
  getSFLFormValues(): void {
    const jsonData = this.schemaFormComponent.getFormValues();
  }
}
```

3. Import the SFLComponent into your template. See example below.

``` HTML
  <sfl-component
   [formDataItems]="formDataItems"
   [config]="config"
   (disableSubmit)="onDisableSubmit($event)"
   (formHeightChange)="onFormHeightChange($event)">
  </sfl-component>
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
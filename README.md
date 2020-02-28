# Schema Form Library (SFL)

This library contains two sets of code:
1. Front end code that consumes JSON 7 Schema and generates a user friendly form that can be used in a web interface
2. Back end code containing a custom validator that is used to validate that the values returned match the schema rules. 

When using the SFL in a project, the front end and backend projects need to install the same version of the SFL via node.

_See our [wiki](https://github.com/CleoDev/schema-form-library/wiki) on how to configure JSON 7 Schema into a visual form._

## Getting Started

### Local SFL Development

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

#### Publishing a new version to Bintray

1. Get a Bintray user configured with upload and download permissions. Talk to Erin and Steve to get this setup.

2. Authenticate your your local environment to access Bintray. Follow this [tutorial](https://www.jfrog.com/confluence/display/BT/npm+Repositories) to insert a `.npmrc` file at the user level for a scoped npm package.

3. Prepare your libary by incrementing the package.json to contain the appropriate version number.
    - _Keep the sfl and sfl-validation packages in sync to avoid any confusion._
    - _If you attempt to publish a package with a version that already exists, npm will be unable to publish to Bintray._

4. At the root level of the project workspace, run the command `npm run publish` to build and publish both the `sfl` and the `sfl-validation` library packages.

5. Remember to update any dependent projects to use the latest version.

### Front End Project Development
#### Prerequisites

1. To use the front end functionality of this library, your project must use:
   - Angular 7
   - [Node.js](https://nodejs.org/en/download/)

2. Install SFL into your project by following the steps for [Installing SFL from Bintray](https://github.com/CleoDev/schema-form-library/#Installing-SFL-from-Bintray)

3. Install icons into your front end Angular project
   1. Open your project's angular.json file. Find the `"assets"` key. Pick a directory to store these images (ex: `./src/assets`).
   2. Copy the directory `./projects/sfl-launcher/src/assets/sfl-images` into your project's assets directory.

#### UI Component Configuration
1. Import the SFL module into your project.
```
import { SFLModule } from '@cleo-cic/sfl';

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

2. Configure your angular component to use the SFL. Reference the example below as well as a detailed list below of the necessary steps.
   - Create a SFLConfig object to control the commonly used confguration items:
      - If this is an edit case
      - If sections are collapsible
      - If there are dividers between sections
   - Inject the SFLDataItemService into your constructor and use the `getFormDataItems()` method to transform the JSON 7 schema and corresponding values into an array of FormDataItems. FormDataItems are the data model that the SFL understands and uses to generate the angular forms.
   - Create a Submit button in your component. Listen to the `disableSubmit` event emitted from the SFL and disable your submit button.
   - Create a ViewChild property in your component to reference your SFLComponent. Use this property to get the submitted form values by calling `this.schemaFormComponent.getFormValues();`
   - [Optional] Listen to the `formHeightChange` event emitted from the SFL.
   
```
import { FormDataItem, SFLComponent, SFLConfig, SFLDataItemService } from '@cleo-cic/sfl';

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

3. Import the SFL component into your template. See example below.

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

To use the back end functionality of this library, it is recommended your project use:
- [Node.js](https://nodejs.org/en/download/)

Install SFL into your project by following the steps for [Installing SFL from Bintray](https://github.com/CleoDev/schema-form-library/#Installing-SFL-with-Git-Links-for-Node)

You will then have access to the following validation classes:
- RequiredSchemaValueValidationService
- SecuredSchemaValueValidationService
- SchemaHelperService

### Installing SFL from Bintray
1. Find the latest released version of the SFL that you would like to pull into your project. Enter the following example into your `dependecies` within your project's `package.json`
```
"@cleo-cic/sfl": "1.0.0"
```

2. Configure your project to use a `.npmrc` file that contains Bintray access. See Erin about configuring this.

3. Pull the SFL into your project by installing dependencies
```
npm install
```

4. Import SFL files into your project from the `@cleo-cic/sfl` package. See example below.
```
import { SFLModule } from '@cleo-cic/sfl';
```

## Versioning

For the versions available, see the [tags on this repository](https://github.com/CleoDev/schema-form-library/tags). 

## Slack Channels
- [schema-form-library](https://cleodev.slack.com/messages/schema-form-library/details/): This is the main channel for discussion of this library.

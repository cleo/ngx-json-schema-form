# JSON Schema Form

This project is a [JSON Schema 7](http://json-schema.org) form builder for Angular 8+. This project contains the front end code that consumes JSON Schema 
and generates a user friendly form that can be used in a web interface.

This code needs to work in tandem with the back end [JSON Schema Form Validation](https://www.npmjs.com/package/@cleo/ngx-json-schema-form-validation) package.

### Getting Started
(1) Install the library in your project

```
npm install @cleo/ngx-json-schema-form
```

(2) Import the JSFModule into your project.
```
@NgModule({
  declarations: [],
  exports: [],
  imports: [
    JSFModule
  ],
  providers: []
})
export class ExampleModule { }
```

(3) Configure your Angular component to use the JSON Schema Form. Reference the example below as well as a detailed list below of the necessary steps.
   - Create a JSFConfig object to control the commonly used confguration items:
      - If this is an edit case
      - If sections are collapsible
      - If there are dividers between sections
   - Inject the JSFDataItemService into your constructor and use the `getFormDataItems()` method to transform the JSON 7 Schema and corresponding values into an array of FormDataItems. FormDataItems are the data model that the JSF understands and uses to generate the angular forms.
   - Create a Submit button in your component. Listen to the `disableSubmit` event emitted from the JSON Schema Form and disable your submit button.
   - Create a ViewChild property in your component to reference your JSFComponent. Use this property to get the submitted form values by calling `this.schemaFormComponent.getFormValues();`
   - [Optional] Listen to the `formHeightChange` event emitted from the JSON Schema Form.

```
@Component({
  selector: 'example',
  templateUrl: 'example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent {
  @ViewChild(JSFComponent, { static: false }) schemaFormComponent: JSFComponent;
  config = new JSFConfig(false, false, true);
  formDataItems: FormDataItem[];
  isSubmitDisabled = true;

  constructor(private jsfDataItemService: JSFDataItemService) {
    // grab schema and values from some service
    this.formDataItems = this.formDataItemService.getFormDataItems(schema, values, this.config.isEdit);
  }

  // this event allows you to enable/disable the submit button in the parent container
  onDisableSubmit(disableSubmit: boolean): void {
    this.isSubmitDisabled = disableSubmit;
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
   [formDataItems]="formDataItems"
   [config]="config"
   (disableSubmit)="onDisableSubmit($event)"
   (formHeightChange)="onFormHeightChange($event)">
  </jsf-component>
```

_Note: be sure to only pass in a valid JSON schema object. If you don't already have your own schemas, you can use a preconfigured schema `projects/jsf-launcher/src/app/schema.json` to test with._

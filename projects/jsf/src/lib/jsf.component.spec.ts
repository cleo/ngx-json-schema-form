import { ChangeDetectionStrategy, ChangeDetectorRef, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JSFComponent } from './jsf.component';
import { JSFConfig } from './jsf-config';
import { JSFJsonSchema } from './jsf-json-schema';
import { JSFSchemaData } from './jsf-schema-data';

describe('JSFComponent', () => {
  const config: JSFConfig = {
    enableCollapsibleSections: false,
    showSectionDivider: true,
    expandOuterSectionsByDefault: true
  };

  const schemaWithValues: JSFJsonSchema = {
    version: '2.0.0',
    type: 'object',
    properties: {
      name: { type: 'string', name: 'Name' }
    }
  };

  // A schema that produces no value-producing fields, so getFormValues() is empty.
  const emptySchema: JSFJsonSchema = {
    version: '2.0.0',
    type: 'object',
    properties: {}
  };

  let fixture: ComponentFixture<JSFComponent>;
  let component: JSFComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JSFComponent]
    });

    fixture = TestBed.createComponent(JSFComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
  });

  it('should emit formReady once after a schema is provided', () => {
    const formReadySpy = jasmine.createSpy('formReady');
    component.formReady.subscribe(formReadySpy);

    fixture.componentRef.setInput('schemaData', new JSFSchemaData(schemaWithValues, {}));
    fixture.detectChanges();

    expect(formReadySpy).toHaveBeenCalledTimes(1);
    expect(Object.keys(component.getFormValues()).length).toBeGreaterThan(0);
  });

  it('should emit formReady even when getFormValues() is empty', () => {
    const formReadySpy = jasmine.createSpy('formReady');
    component.formReady.subscribe(formReadySpy);

    fixture.componentRef.setInput('schemaData', new JSFSchemaData(emptySchema, {}));
    fixture.detectChanges();

    expect(formReadySpy).toHaveBeenCalledTimes(1);
    expect(component.getFormValues()).toEqual({});
  });

  it('should emit formReady again when schemaData is replaced with a new schema', () => {
    const formReadySpy = jasmine.createSpy('formReady');
    component.formReady.subscribe(formReadySpy);

    fixture.componentRef.setInput('schemaData', new JSFSchemaData(emptySchema, {}));
    fixture.detectChanges();
    expect(formReadySpy).toHaveBeenCalledTimes(1);

    fixture.componentRef.setInput('schemaData', new JSFSchemaData(schemaWithValues, {}));
    fixture.detectChanges();
    expect(formReadySpy).toHaveBeenCalledTimes(2);
  });

  it('should render the form fields after schemaData is provided asynchronously', () => {
    // No schemaData yet — simulate an async (e.g. HTTP) source.
    fixture.detectChanges();

    fixture.componentRef.setInput('schemaData', new JSFSchemaData(schemaWithValues, {}));
    fixture.detectChanges();

    expect(component.formDataItems.length).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('input').length).toBeGreaterThan(0);
  });

  it('should mark the view for check on every schemaData change so OnPush re-renders', () => {
    const cd = (component as unknown as { cd: ChangeDetectorRef }).cd;
    const markForCheckSpy = spyOn(cd, 'markForCheck').and.callThrough();

    fixture.componentRef.setInput('schemaData', new JSFSchemaData(emptySchema, {}));
    fixture.detectChanges();
    expect(markForCheckSpy).toHaveBeenCalledTimes(1);

    fixture.componentRef.setInput('schemaData', new JSFSchemaData(schemaWithValues, {}));
    fixture.detectChanges();
    expect(markForCheckSpy).toHaveBeenCalledTimes(2);
  });
});
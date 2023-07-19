import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JSFModule } from '../../../jsf/src/lib/jsf.module';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TemplateComponent } from './template-component/template.component';

@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    JSFModule,
    FormsModule.withConfig({callSetDisabledState: 'whenDisabledForLegacyCode'})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

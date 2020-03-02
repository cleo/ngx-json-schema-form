import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JSFModule } from '../../../jsf/src/lib/jsf.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    JSFModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SFLModule } from '../../../sfl/src/lib/sfl.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SFLModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

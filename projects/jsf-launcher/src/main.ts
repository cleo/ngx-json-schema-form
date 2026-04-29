import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';

ModuleRegistry.registerModules([AllCommunityModule]);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      FormsModule.withConfig({
        callSetDisabledState: 'whenDisabledForLegacyCode'
      })
    )
  ]
}).catch(err => console.error(err));

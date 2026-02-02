
import { NgModule } from "@angular/core";
import { AgGridModule } from "ag-grid-angular";
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

@NgModule({
  imports: [AgGridModule],
  exports: [AgGridModule]
})
export class AgGridBridgeModule {}
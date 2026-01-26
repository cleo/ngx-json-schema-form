
import { NgModule } from "@angular/core";
import { AgGridModule } from "ag-grid-angular";


@NgModule({
  imports: [AgGridModule],
  exports: [AgGridModule]
})
export class AgGridBridgeModule {}
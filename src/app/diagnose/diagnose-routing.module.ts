import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiagnosePage } from './diagnose.page';

const routes: Routes = [
  {
    path: '',
    component: DiagnosePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiagnosePageRoutingModule {}

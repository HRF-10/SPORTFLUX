import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FisioterapisPage } from './fisioterapis.page';

const routes: Routes = [
  {
    path: '',
    component: FisioterapisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FisioterapisPageRoutingModule {}

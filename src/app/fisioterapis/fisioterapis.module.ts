import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FisioterapisPageRoutingModule } from './fisioterapis-routing.module';

import { FisioterapisPage } from './fisioterapis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FisioterapisPageRoutingModule
  ],
  declarations: [FisioterapisPage]
})
export class FisioterapisPageModule {}

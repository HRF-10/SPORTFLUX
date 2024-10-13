import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiagnosePageRoutingModule } from './diagnose-routing.module';

import { DiagnosePage } from './diagnose.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiagnosePageRoutingModule
  ],
  declarations: [DiagnosePage]
})
export class DiagnosePageModule {}

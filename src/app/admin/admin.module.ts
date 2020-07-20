import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewRoleComponent } from './view-role/view-role.component';



@NgModule({
  declarations: [ViewRoleComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [ViewRoleComponent]
})
export class AdminModule { }

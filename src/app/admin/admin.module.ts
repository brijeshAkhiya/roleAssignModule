import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../material/material.module';
import { ViewRoleComponent } from './view-role/view-role.component';

@NgModule({
  declarations: [ViewRoleComponent],
  exports: [ViewRoleComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
})
export class AdminModule { }

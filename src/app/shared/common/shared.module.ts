import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FilterPipe } from './filter.pipe';
import { SumPipe } from './sum.pipe';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {DirectiveModule} from '../../directive/directive.module';
import {ComponentsModule} from '../../components/components.module';
import { CommonMaterialModule } from './common-material-module';


@NgModule({
  declarations: [FilterPipe, SumPipe],
  providers: [
  ],
  exports: [
    FilterPipe,
    SumPipe,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ReactiveFormsModule,
    ComponentsModule,
    DirectiveModule,
    CommonMaterialModule,
  ]
})
export class SharedModule { }

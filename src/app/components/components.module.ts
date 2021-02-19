import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    NgxPaginationModule
  ],
  declarations: [
    PaginationComponent,
  ],
  exports: [
    NgxPaginationModule,
    PaginationComponent,
  ]
})
export class ComponentsModule { }

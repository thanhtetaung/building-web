import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DropdownDirective} from './dropdown.directive';
import { EqualValidatorDirective } from './equal-validator.directive';

@NgModule({
  exports: [
    CommonModule,
    DropdownDirective,
    EqualValidatorDirective
  ],
  declarations: [DropdownDirective, EqualValidatorDirective]
})
export class DirectiveModule { }

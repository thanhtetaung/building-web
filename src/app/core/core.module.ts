import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/common/shared.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import { FileUploadModule } from '@iplab/ngx-file-upload';


@NgModule({
  imports: [
    AppRoutingModule,
    SharedModule,
    CommonModule,
    FileUploadModule,
  ],
  declarations: [
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    ChangePasswordComponent,
    ProfileComponent,
  ],
  exports: [
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    ChangePasswordComponent,
  ]
})
export class CoreModule { }

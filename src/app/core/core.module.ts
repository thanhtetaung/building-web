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
import { LightboxModule } from 'ngx-lightbox';
import { FooterComponent } from './footer/footer.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { VerificationComponent } from './verification/verification.component';
import { BuildingComponent } from './building/building.component';

@NgModule({
  imports: [
    AppRoutingModule,
    SharedModule,
    CommonModule,
    FileUploadModule,
    LightboxModule,
    LazyLoadImageModule
  ],
  declarations: [
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    ChangePasswordComponent,
    ProfileComponent,
    FooterComponent,
    VerificationComponent,
    BuildingComponent,
  ],
  exports: [
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    ChangePasswordComponent,
  ]
})
export class CoreModule { }

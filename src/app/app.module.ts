import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuardService } from './shared/authentication/auth.guard.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonMaterialModule } from './shared/common/common-material-module';
import { TdDialogService } from '@covalent/core/dialogs';
import { HistoryService } from './services/history-service';
import { UserService } from './services/user.service';
import { UiUtil } from './util/ui-util';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from './shared/common/date-util';
import { WebserviceInterceptor } from './services/webservice-interceptor';
import { SharedModule } from './shared/common/shared.module';
import { CoreModule } from './core/core.module';
import { BuildingService } from './services/building.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    CoreModule,

  ],
  exports: [
  ],
  providers: [
    AuthGuardService,
    {provide: HTTP_INTERCEPTORS, useClass: WebserviceInterceptor, multi: true},
    HttpClient,
    UiUtil,
    TdDialogService,
    HistoryService,
    UserService,
    BuildingService,
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

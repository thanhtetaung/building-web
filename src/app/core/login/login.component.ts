import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/components/base.component';
import { User } from 'src/app/models/user';
import { HistoryService } from 'src/app/services/history-service';
import { UserService } from 'src/app/services/user.service';
import { UiUtil } from 'src/app/util/ui-util';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {

  user: User = new User();
  isLogingIn = false;

  @ViewChild('loginForm', {static: true}) loginForm!: NgForm;
  errorMessage: string | undefined;

  constructor(private userService: UserService, router: Router, uiUtil: UiUtil,
    location: Location, historyService: HistoryService) {
    super(uiUtil, router, location, historyService);
  }

  ngOnInit(): void {
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.control.markAllAsTouched();
      return;
    }
    this.isLogingIn = true;
    this.userService.login(this.user.username, this.user.password)
    .subscribe((user: User) => {
      this.isLogingIn = false;
      localStorage.setItem('username', user.username);
      localStorage.setItem('accessToken', user.token);
      this.loginForm.reset();
      this.router.navigate(['/']);
    }, (e: HttpErrorResponse) => {
        if (e.status == 401) {
          this.loginForm.controls.username.setErrors({ invalid: true });
          this.loginForm.controls.password.setErrors({ invalid: true });
          this.errorMessage = 'ユーザー名またはパスワードは無効です。';
        } else {
          this.errorMessage = e.error.message ?? e.message;
        }
        this.isLogingIn = false;
    });
  }

}

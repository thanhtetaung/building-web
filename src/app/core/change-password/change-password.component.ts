import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/components/base.component';
import { User } from 'src/app/models/user';
import { HistoryService } from 'src/app/services/history-service';
import { UserService } from 'src/app/services/user.service';
import { UiUtil } from 'src/app/util/ui-util';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent extends BaseComponent implements OnInit {

  user: User = new User();
  isUpdating = false;

  @ViewChild('form', {static: true}) form!: NgForm;
  errorMessage!: string;

  constructor(private userService: UserService, router: Router, uiUtil: UiUtil,
    location: Location, historyService: HistoryService) {
    super(uiUtil, router, location, historyService);
  }

  ngOnInit(): void {
  }

  update() {
    if (this.form.invalid) {
      this.form.control.markAllAsTouched();
      return;
    }
    this.isUpdating = true;
    this.userService.changePassword(this.user.oldPassword, this.user.newPassword)
    .subscribe((_) => {
      this.uiUtil.showMessage('パスワードを更新しました！');
      this.isUpdating = false;
    }, (e: HttpErrorResponse) => {
        if (e.error.message && e.error.message == 'invalid oldPassword.') {
          this.form.controls.oldPassword.setErrors({ invalid: true });
        } else {
          this.errorMessage = e.error.message ?? e.message;
        }
        this.isUpdating = false;
    });
  }

}

import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SELECT_PANEL_INDENT_PADDING_X } from '@angular/material/select';
import { Router } from '@angular/router';
import { TdDialogService } from '@covalent/core/dialogs';
import { BaseComponent } from 'src/app/components/base.component';
import { User } from 'src/app/models/user';
import { HistoryService } from 'src/app/services/history-service';
import { UserService } from 'src/app/services/user.service';
import { UiUtil } from 'src/app/util/ui-util';
import { VerificationComponent } from '../verification/verification.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponent implements OnInit {

  verifiedEmail!: string
  code!: string
  isRequesting = false
  isVerified = false
  isRegistering = false



  user: User = new User();

  @ViewChild('registerForm', {static: true}) registerForm!: NgForm;
  errorMessage!: string;

  constructor(private userService: UserService, router: Router, uiUtil: UiUtil,
    location: Location, historyService: HistoryService, private dialogService: TdDialogService) {
    super(uiUtil, router, location, historyService);
  }

  ngOnInit(): void {
  }

  onEmailChange() {
    if (this.verifiedEmail && this.user.email === this.verifiedEmail) {
      this.isVerified = true;
    } else {
      this.isVerified = false;
    }
  }

  openVerificationDialog() {
    this.dialogService.open(VerificationComponent, {
      disableClose: true,
      data: {
        email: this.user.email
      }
    })
    .afterClosed()
    .subscribe((result) => {
      if (result) {
        this.isVerified = true;
        this.verifiedEmail = this.user.email;
        this.code = result;
      }
    });
  }

  requestVerification() {
    if (!this.isVerified && this.user.email && !this.registerForm.controls.email.hasError('email')) {
      this.isRequesting = true;
      this.userService.requestVerification(this.user.email)
        .subscribe((_) => {
          this.isRequesting = false;
          this.openVerificationDialog();
        }, (e: HttpErrorResponse) => {
          this.isRequesting = false;
          this.uiUtil.showMessage(e.error.message ?? e.message);
        });
    }
  }

  register() {
    this.isRegistering = true;
    if (this.registerForm.invalid) {
      this.registerForm.control.markAllAsTouched();
      return;
    }

    if (!this.verifiedEmail) {
      this.registerForm.controls.email.setErrors({ notVerified: true });
      return;
    }


    this.isRegistering = true;
    this.userService.register(this.user, this.code)
      .subscribe((user: User) => {
        this.isRegistering = false;
        this.uiUtil.showMessage('登録成功！')
        .subscribe(() => {
          this.router.navigate(['/login']);
        });

      }, (e: HttpErrorResponse) => {
          this.errorMessage = e.error.message ?? e.message;
          this.isRegistering = false;
      });
  }

}

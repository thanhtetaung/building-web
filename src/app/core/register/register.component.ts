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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponent implements OnInit {

  user: User = new User();

  @ViewChild('registerForm', {static: true}) registerForm!: NgForm;
  errorMessage!: string;

  constructor(private userService: UserService, router: Router, uiUtil: UiUtil,
    location: Location, historyService: HistoryService) {
    super(uiUtil, router, location, historyService);
  }

  ngOnInit(): void {
  }

  register() {
    if (this.registerForm.invalid) {
      return;
    }
    this.userService.register(this.user)
    .subscribe((user: User) => {
      this.uiUtil.showMessage('Register successful!')
      .subscribe(() => {
        this.router.navigate(['/login']);
      });

    }, (e: HttpErrorResponse) => {
        if (e.error.message) {
          this.errorMessage = e.error.message;
        } else {
          this.errorMessage = e.message;
        }
    });
  }

}

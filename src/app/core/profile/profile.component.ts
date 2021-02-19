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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseComponent implements OnInit {

  user: User = new User();

  @ViewChild('form', {static: true}) form!: NgForm;
  errorMessage!: string;

  constructor(private userService: UserService, router: Router, uiUtil: UiUtil,
    location: Location, historyService: HistoryService) {
    super(uiUtil, router, location, historyService);
  }

  ngOnInit(): void {
    this.userService.profile()
      .subscribe((u) => {
        this.user = u;
      });
  }

  update() {
    if (this.form.invalid) {
      return;
    }
    this.userService.update(this.user)
    .subscribe((_) => {
      this.uiUtil.showMessage('Profile updated!');

    }, (e: HttpErrorResponse) => {
        if (e.error.message) {
          this.errorMessage = e.error.message;
        } else {
          this.errorMessage = e.message;
        }
    });
  }

}

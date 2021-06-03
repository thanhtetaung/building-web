import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { UiUtil } from 'src/app/util/ui-util';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit, AfterViewInit {

  email!: string
  code!: string
  resending = false
  verifying = false

  @ViewChild('code1') code1!: ElementRef;
  @ViewChild('code2') code2!: ElementRef;
  @ViewChild('code3') code3!: ElementRef;
  @ViewChild('code4') code4!: ElementRef;
  @ViewChild('code5') code5!: ElementRef;
  @ViewChild('code6') code6!: ElementRef;

  codeEles: Array<ElementRef> = [];
  errorMessage!: string;

  constructor(private userService: UserService, private uiUtil: UiUtil,
    private dialogRef: MatDialogRef<VerificationComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.email = data.email;
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.code1.nativeElement.focus();
    this.codeEles = [ this.code1, this.code2, this.code3, this.code4, this.code5, this.code6];
  }

  onPaste(event: ClipboardEvent) {
    let clipboardData = event.clipboardData || (<any>window).clipboardData;;
    let pastedText = clipboardData.getData('text');
    let lastEle = this.codeEles[0];
    this.codeEles.forEach((e, i) => {
      if (pastedText.length - 1 >= i) {
        e.nativeElement.value = pastedText.charAt(i);
        lastEle = e;
      }
    });
    setTimeout(() => lastEle.nativeElement.focus(), 10);
    if (pastedText.length >= 6) {
      this.verify();
    }
    return false;
  }

  onKeydown(e, ele): boolean {
    let index = this.codeEles.findIndex((c) => c.nativeElement == ele);
    if (index == -1) return false;
    if((e.key >= 0 && e.key <=9) || (e.keyCode >= 65 && e.keyCode <= 90)) {
      this.codeEles[index].nativeElement.value = ''
      if (index < 5) {
        setTimeout(() => this.codeEles[index + 1].nativeElement.focus(), 10);
      } else if (index == 5) {
        setTimeout(() => this.verify(), 10);
      }
    } else if(e.key === 'Backspace' && index != 0) {
        setTimeout(() => this.codeEles[index - 1].nativeElement.focus(), 10)
    } else if (e.key !== 'Backspace') {
      return false;
    }
    return true;
 }

  resend() {
    this.resending = true;
    this.userService.requestVerification(this.email)
        .subscribe((_) =>
        {
          this.resending = false;
        }, (e: HttpErrorResponse) => {
            this.errorMessage = e.error.message ?? e.message;
            this.resending = false;
        });

  }

  verify() {
    this.code = '';
    this.codeEles.forEach(e => this.code += e.nativeElement.value)
    if (this.code.length != 6) {
      return;
    }
    this.verifying = true;
    this.userService.verify(this.email, this.code)
      .subscribe((_) => {
        this.verifying = false;
        this.dialogRef.close(this.code);
      }, (e: HttpErrorResponse) => {
        let message = e.error.message ?? e.message;
        if (message === 'invalid otp') {
          this.errorMessage = 'OTPは無効です。';
        } else if (message === 'otp is expired.') {
          this.errorMessage = 'OTP の有効期限が切れています。';
        } else if (message === 'email is already verified.') {
          this.errorMessage = 'メールを確認しました。';
        } else {
          this.errorMessage = message;
        }
        this.verifying = false;
      });
  }

}

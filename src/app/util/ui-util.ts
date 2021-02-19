import { Injectable } from '@angular/core';
import { TdDialogService } from '@covalent/core/dialogs';
import { Observable } from 'rxjs';

@Injectable()
export class UiUtil {
  constructor(private dialogService: TdDialogService) {}

  showError(message: string): Observable<any> {
    return this.dialogService.openAlert({
      message: message,
      title: 'Error',
      closeButton: 'Ok',
    }).afterClosed();
  }

  showMessage(message: string): Observable<any> {
    return this.showMessageWithTitle(message, 'Info');
  }

  showMessageWithTitle(message: string, title: string): Observable<any> {
    return this.dialogService.openAlert({
      message: message,
      title: title,
      closeButton: 'Ok',
    }).afterClosed();
  }

  showConfirm(message: string): Observable<boolean> {
    return this.dialogService.openConfirm({
      message: message,
      title: 'Confirmation',
      cancelButton: 'Cancel',
      acceptButton: 'Yes'
    }).afterClosed();
  }

}

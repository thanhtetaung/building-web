import {UiUtil} from '../util/ui-util';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {HistoryService} from '../services/history-service';
import { HttpErrorResponse } from '@angular/common/http';

export class BaseComponent {
  uiUtil: UiUtil;
  router: Router;
  location: Location;
  errorMessage: string | undefined;
  historyService: HistoryService;
  constructor( uiUtil: UiUtil, router: Router, location: Location, historyService: HistoryService) {
    this.uiUtil = uiUtil;
    this.router = router;
    this.location = location;
    this.historyService = historyService;
  }

  doLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 0);

  }

  handleError(response: HttpErrorResponse) {
    if (response.status === 401) {
      this.doLogout();
      return true;
    } else {
      this.errorMessage = response.message;
      return true;
    }
    return false;
  }

  handleErrorWithAlert(response: HttpErrorResponse) {
    if (response.status === 401) {
      this.doLogout();
      return true;
    } else {
      console.log('Response Msg : ' + response.error.message ?? response.message);
      this.uiUtil.showError(response.error.message ?? response.message);
      return true;
    }
    return false;
  }

  back(defaultUrl: string) {
    const preUrl = localStorage.getItem('previousUrl');
    if (preUrl) {
      this.location.back();
    } else {
      this.router.navigate([defaultUrl]);
    }
  }

  numberRestrict(event: any): boolean {
    if (event.keyCode === 8 || event.keyCode === 46
      || event.keyCode === 37 || event.keyCode === 39) {
      return true;
    }

    let pattern =  /^[1-9]\d*$/;
    if (event.target.value.length > 0) {
      pattern =  /^[0-9]\d*$/;
    }

    let inputChar = String.fromCharCode(event.charCode);

    if (event.clipboardData) {
      inputChar = event.clipboardData.getData('text');
    }

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
    return false;
  }

  numberWithZeroRestrict(event: any): boolean {
      if (event.keyCode === 8 || event.keyCode === 46
          || event.keyCode === 37 || event.keyCode === 39) {
          return true;
      }

      const pattern =  /^[0-9]\d*$/;
      let inputChar = String.fromCharCode(event.charCode);

      if (event.clipboardData) {
          inputChar = event.clipboardData.getData('text');
      }

      if (!pattern.test(inputChar)) {
          // invalid character, prevent input
          event.preventDefault();
      }
      return false;
  }

  parseFloat(str: string): number {
    if (str) {
      return +str;
    }
    return 0;
  }
}

import {BaseComponent} from './base.component';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {HistoryService} from '../services/history-service';
import {UiUtil} from '../util/ui-util';

export class BaseListComponent extends BaseComponent {
  page = 1;
  recordPerPage = 10;
  totalRecord = 0;
  sort: string | null = null;

  constructor( uiUtil: UiUtil, router: Router, location: Location, historyService: HistoryService) {
    super(uiUtil, router, location, historyService);
  }

  // To be override
  search() {

  }

  pageChanged(newPageNumber: number) {
    this.page = newPageNumber;
    this.search();
  }

  sorting(name: string) {
    if (this.sort && this.sort.indexOf(name + ',asc') > -1) {
      this.sort = name + ',desc';
    } else if (this.sort && this.sort.indexOf(name + ',desc') > -1) {
      this.sort = null;
    } else {
      this.sort = name + ',asc';
    }
    this.search();
  }

}

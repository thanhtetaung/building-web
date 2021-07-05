import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Event, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { BaseComponent } from './components/base.component';
import { HistoryService } from './services/history-service';
import { AuthGuardService } from './shared/authentication/auth.guard.service';
import { UiUtil } from './util/ui-util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit {

  title = 'bukurou'

  authGuardService: AuthGuardService;

  @ViewChild('drawer', {static: true})
  drawer!: MatDrawer;

  constructor(uiUtil: UiUtil, router: Router, location: Location,
              authGuardService: AuthGuardService, historyService: HistoryService) {
    super(uiUtil, router, location, historyService);

    this.authGuardService = authGuardService;

    this.router.events.subscribe((event: Event) => {
      // if (event instanceof NavigationStart) {
      // }

      if (event instanceof NavigationError) {
        // Handle error
        console.error(event.error);
      }

      if (event instanceof NavigationEnd) {
        if (event) {
          this.historyService.previous = event.url;
        }
      }
    });
  }

  navigate(commands: [string]) {
    this.drawer.close();
    this.router.navigate(commands);
  }

  ngOnInit() {
    // hide preloader
    document.getElementById('preloader-5')!.style.display = 'none';
  }
}

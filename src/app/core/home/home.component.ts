import { DOCUMENT, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { retry } from 'rxjs/operators';
import { BaseComponent } from 'src/app/components/base.component';
import { Blueprint } from 'src/app/models/blueprint';
import { Building } from 'src/app/models/building';
import { BuildingService } from 'src/app/services/building.service';
import { HistoryService } from 'src/app/services/history-service';
import { WebserviceInterceptor } from 'src/app/services/webservice-interceptor';
import { WebsocketService } from 'src/app/services/websocket.service';
import { UiUtil } from 'src/app/util/ui-util';
import { valueTextMap } from '../../config/const';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit {

  useDistrictsMap = valueTextMap.useDistricts;
  fireZoneMap = valueTextMap.fireZone;
  statusMap = valueTextMap.status;
  buildings!: Array<Blueprint>;
  websocketService!: WebsocketService;

  constructor(private buildingService: BuildingService, router: Router, uiUtil: UiUtil,
    location: Location, historyService: HistoryService,
    @Inject(DOCUMENT) private document: Document, private changeDetectorRef: ChangeDetectorRef) {
    super(uiUtil, router, location, historyService);

    // //dummy
    // let response = new UploadResponse();
    // let fileMeta = new FileMeta();
    // fileMeta.imageUrl = '';
    // response.fileMetas.push(fileMeta);
    // this.uploadedResponses.push(response);
  }

  ngOnInit() {
    this.load();
    this.websocketService = new WebsocketService();
    this.websocketService.connect()
      .pipe(retry())
      .subscribe(message => {
        console.log(message);
        this.load(true);
      },
      err => console.log(err));
  }

  load(notify = false) {
    this.buildingService.getBuildings()
      .subscribe((buildings) => {
        this.buildings = buildings;
        if (notify) {
          this.changeDetectorRef.detectChanges();
        }
      }, (e: HttpErrorResponse) => {
        this.handleErrorWithAlert(e);
    });
  }

  ngOnDestroy() {
    this.websocketService.close();
  }

}

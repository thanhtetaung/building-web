import { DOCUMENT, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadControl, FileUploadValidators } from '@iplab/ngx-file-upload';
import { BaseComponent } from 'src/app/components/base.component';
import { Blueprint } from 'src/app/models/blueprint';
import { BlueprintAnalysisResponse } from 'src/app/models/blueprint-analysis-response';
import { FileMeta } from 'src/app/models/file-meta';
import { UploadResponse } from 'src/app/models/upload-response';
import { BuildingService } from 'src/app/services/building.service';
import { HistoryService } from 'src/app/services/history-service';
import { UiUtil } from 'src/app/util/ui-util';
import { valueTextMap } from '../../config/const';
import { Lightbox } from 'ngx-lightbox';
import { environment } from 'src/environments/environment';
import { MatSidenavContent } from '@angular/material/sidenav';
import { WebsocketService } from 'src/app/services/websocket.service';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.scss']
})
export class BuildingComponent extends BaseComponent implements OnInit {

  blueprint = new Blueprint();
  progress = 0;
  isUploading = false;
  result: BlueprintAnalysisResponse | undefined;
  isSubmiting = false;
  websocketService!: WebsocketService;

  showUploadBox = true

  useDistrictsMap = valueTextMap.useDistricts;
  specialRoadExistenceMap = valueTextMap.specialRoadExistence;
  blueprintTypeMap = valueTextMap.blueprintType;


  @ViewChild('blueprintForm', {static: true}) blueprintForm!: NgForm;
  public uploadedResponses: Array<UploadResponse> = [];

  @ViewChild('resultContent')
  resultContent!: ElementRef;

  @ViewChild('failedContent')
  failedContent!: ElementRef;

  @ViewChild('uploadBox')
  uploadbox!: ElementRef;

  public fileControl = new FileUploadControl(FileUploadValidators.filesLimit(2)).setListVisibility(false);

  constructor(private buildingService: BuildingService, router: Router, uiUtil: UiUtil,
    location: Location, historyService: HistoryService,
    @Inject(DOCUMENT) private document: Document, private _lightbox: Lightbox,
    private el: ElementRef, private sideNavContent: MatSidenavContent, private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef) {
    super(uiUtil, router, location, historyService);

    // //dummy
    // let response = new UploadResponse();
    // let fileMeta = new FileMeta();
    // fileMeta.imageUrl = '';
    // response.fileMetas.push(fileMeta);
    // this.uploadedResponses.push(response);
  }

  ngOnInit(): void {
    this.fileControl.setListVisibility(false);
    this.fileControl.valueChanges.subscribe(() => {
      if (this.fileControl.value.length > 0) {
        this.isUploading = true;
        let file = this.fileControl.value[0];
        this.buildingService.upload(this.fileControl.value[0])
        .subscribe((response) => {
          if (response instanceof UploadResponse) {
            response.fileName = file.name;
            response.fileMetaInfos = response.imageList.map((img) => {
              let fileMeta = new FileMeta();
              fileMeta.imageUrl = img;
              return fileMeta;
            });
            this.uploadedResponses.push(response);
            this.showUploadBox = false
          } else {
            this.progress = response.progress;
          }

        }, (e) => {
          this.handleErrorWithAlert(e);
        }, () => {
          this.isUploading = false;
          this.fileControl.setValue([]);
        });
      }
    });

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.load(id);
    }

    this.websocketService = new WebsocketService();
    this.websocketService.connect()
      .pipe(retry())
      .subscribe(message => {
        console.log(message);
        if (message.executionArn === this.blueprint.executionArn) {;
          this.load(this.blueprint.id, true);
        }
      },
      err => console.log(err));
  }

  load(id: string, notify = false) {
    this.buildingService.getBuilding(id)
    .subscribe((res) => {
      this.showUploadBox = false;
      this.blueprint = res;
      if (res.processingStatus === 'SUCCEEDED') {
        this.result = res.result;
        setTimeout(()=> {
          this.resultContent.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }, 20);
      } else if(res.processingStatus === 'FAILED') {
        setTimeout(()=> {
          this.failedContent.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }, 20);
      }
      this.uploadedResponses = res.imageMetaInfos.map((info) => {
        info.fileMetaInfos = info.fileMetaInfos.map((fileMeta, i) => {
          fileMeta.imageUrl = info.imageList[i];
          return fileMeta;
        });
        return info;
      });

      if (notify) {
        this.changeDetectorRef.detectChanges();
      }
    }, (e: HttpErrorResponse) => {
      this.handleErrorWithAlert(e);
    });
  }

  showUploadBoxAndScroll() {
    this.showUploadBox = true;
    setTimeout(() => {
      this.sideNavContent.scrollTo({
        behavior: 'smooth',
        left: 0,
        top: this.uploadbox.nativeElement.offsetTop - 150
      });
    }, 200);

  }

  imageUrl(relativePath: string) {
    return environment.baseUrl + "v1/" + relativePath + '?dpi=400&access_token=' + localStorage.getItem('accessToken');
  }

  submit() {
    if (this.blueprintForm.invalid || this.uploadedResponses.length === 0) {
      this.blueprintForm.control.markAllAsTouched();
      setTimeout(() => {
        this.scrollToFirstInvalidControl();
      }, 200);
      return;
    }
    this.blueprint.files = this.uploadedResponses.map(response => environment.baseUrl + "v1/" + response.path);
    this.blueprint.imageMetaInfos = this.uploadedResponses;
    this.blueprint.fileMetaInfos = this.uploadedResponses.map(response => response.fileMetaInfos.filter(meta => meta.include === true));

    this.isSubmiting = true;
    this.buildingService.blueprintAnalysis(this.blueprint)
      .subscribe((res) => {
        this.blueprint = res;
        this.uploadedResponses = res.imageMetaInfos.map((info) => {
          info.fileMetaInfos = info.fileMetaInfos.map((fileMeta, i) => {
            fileMeta.imageUrl = info.imageList[i];
            return fileMeta;
          });
          return info;
        });
        if (res.processingStatus === 'SUCCEEDED') {
          this.result = res.result;
          setTimeout(()=> {
            this.isSubmiting = false;
            this.resultContent.nativeElement.scrollIntoView({ behavior: 'smooth' });
          }, 20);
        } else {
          this.isSubmiting = false;
        }

        // dummy img override
        // this.result.externalShapeDrawnImgs.forEach(img => img.img = 'https://husky-ai-data.s3.amazonaws.com/building_blueprint_analysis/result_files/JngjndfjhBfj/eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdE5hbWUiOiJLb3VyeXUiLCJsYXN0TmFtZSI6IktpbiIsInJvbGVOYW1lIjoiUk9MRV9VU0VSIiwidXNlcm5hbWUiOiJrb211Z2kiLCJzdWIiOiJrb211Z2kiLCJpc3MiOiJadWx1IiwiZXhwIjoxNjQ2Mjk0NTk2LCJpYXQiOjE2MTQ3NTg1OTZ9.BuiFLXY0HzaiV4V2FHzoxJpPIPJlXjWbWcsSgEeipdw//area_table_external_shape_drawn_img_0.png?AWSAccessKeyId=AKIAIAGWIZNVODLSWWMQ&Signature=ZOb8QradixTWTwpWf81RpRplrFM%3D&Expires=1617902617')
        // this.result.fixtureSymbolDrawnImgs.forEach(img => img.img = 'https://husky-ai-data.s3.amazonaws.com/building_blueprint_analysis/result_files/JngjndfjhBfj/eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdE5hbWUiOiJLb3VyeXUiLCJsYXN0TmFtZSI6IktpbiIsInJvbGVOYW1lIjoiUk9MRV9VU0VSIiwidXNlcm5hbWUiOiJrb211Z2kiLCJzdWIiOiJrb211Z2kiLCJpc3MiOiJadWx1IiwiZXhwIjoxNjQ2Mjk0NTk2LCJpYXQiOjE2MTQ3NTg1OTZ9.BuiFLXY0HzaiV4V2FHzoxJpPIPJlXjWbWcsSgEeipdw//area_table_external_shape_drawn_img_0.png?AWSAccessKeyId=AKIAIAGWIZNVODLSWWMQ&Signature=ZOb8QradixTWTwpWf81RpRplrFM%3D&Expires=1617902617')

      }, (e: HttpErrorResponse) => {
        this.isSubmiting = false;
        this.handleErrorWithAlert(e);
      });
  }

  private scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector("form .ng-invalid");

    window.scroll({
      top: this.getTopOffset(firstInvalidControl),
      left: 0,
      behavior: "smooth"
    });
  }

  private getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = 150;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }

  trackByIndex(index: number, object: any) {
    return index;
  }

  openImagePreView(url: string) {
    this._lightbox.open([{
      src: url,
      thumb: url
   }], 0, { showZoom: true });
  }

  remove(index: number) {
    this.uploadedResponses.splice(index, 1);
    if (this.uploadedResponses.length == 0) {
        this.showUploadBox = true;
    }
  }

  range(range: number) {
    if (this.blueprint.floorAreas.length > range) {
      this.blueprint.floorAreas.splice(range);
    }

    return new Array(range);
  }

  ngOnDestroy() {
    this.websocketService.close();
  }
}

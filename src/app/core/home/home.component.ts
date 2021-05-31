import { DOCUMENT, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit {

  blueprint = new Blueprint();
  progress = 0;
  isUploading = false;
  result: BlueprintAnalysisResponse | undefined;

  showUploadBox = true

  useDistrictsMap = valueTextMap.useDistricts;
  specialRoadExistenceMap = valueTextMap.specialRoadExistence;
  blueprintTypeMap = valueTextMap.blueprintType;


  @ViewChild('blueprintForm', {static: true}) blueprintForm!: NgForm;
  public uploadedResponses: Array<UploadResponse> = [];

  @ViewChild('resultContent')
  resultContent!: ElementRef;

  @ViewChild('uploadBox')
  uploadbox!: ElementRef;

  public fileControl = new FileUploadControl(FileUploadValidators.filesLimit(2)).setListVisibility(false);

  constructor(private buildingService: BuildingService, router: Router, uiUtil: UiUtil,
    location: Location, historyService: HistoryService,
    @Inject(DOCUMENT) private document: Document, private _lightbox: Lightbox,
    private el: ElementRef, private sideNavContent: MatSidenavContent) {
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
          if (e.error.message) {
            this.uiUtil.showMessage(e.error.message);
          } else {
            this.errorMessage = e.message;
          }

        }, () => {
          this.isUploading = false;
          this.fileControl.setValue([]);
        });
      }
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
      setTimeout(() => {
        this.scrollToFirstInvalidControl();
      }, 200);

      return;
    }
    this.blueprint.files = this.uploadedResponses.map(response => environment.baseUrl + "v1/" + response.path);
    this.blueprint.fileMetaInfos = this.uploadedResponses.map(response => response.fileMetaInfos.filter(meta => meta.include === true))
    this.buildingService.blueprintAnalysis(this.blueprint)
      .subscribe((res) => {
        this.result = res;
        // dummy img override
        // this.result.externalShapeDrawnImgs.forEach(img => img.img = 'https://husky-ai-data.s3.amazonaws.com/building_blueprint_analysis/result_files/JngjndfjhBfj/eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdE5hbWUiOiJLb3VyeXUiLCJsYXN0TmFtZSI6IktpbiIsInJvbGVOYW1lIjoiUk9MRV9VU0VSIiwidXNlcm5hbWUiOiJrb211Z2kiLCJzdWIiOiJrb211Z2kiLCJpc3MiOiJadWx1IiwiZXhwIjoxNjQ2Mjk0NTk2LCJpYXQiOjE2MTQ3NTg1OTZ9.BuiFLXY0HzaiV4V2FHzoxJpPIPJlXjWbWcsSgEeipdw//area_table_external_shape_drawn_img_0.png?AWSAccessKeyId=AKIAIAGWIZNVODLSWWMQ&Signature=ZOb8QradixTWTwpWf81RpRplrFM%3D&Expires=1617902617')
        // this.result.fixtureSymbolDrawnImgs.forEach(img => img.img = 'https://husky-ai-data.s3.amazonaws.com/building_blueprint_analysis/result_files/JngjndfjhBfj/eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdE5hbWUiOiJLb3VyeXUiLCJsYXN0TmFtZSI6IktpbiIsInJvbGVOYW1lIjoiUk9MRV9VU0VSIiwidXNlcm5hbWUiOiJrb211Z2kiLCJzdWIiOiJrb211Z2kiLCJpc3MiOiJadWx1IiwiZXhwIjoxNjQ2Mjk0NTk2LCJpYXQiOjE2MTQ3NTg1OTZ9.BuiFLXY0HzaiV4V2FHzoxJpPIPJlXjWbWcsSgEeipdw//area_table_external_shape_drawn_img_0.png?AWSAccessKeyId=AKIAIAGWIZNVODLSWWMQ&Signature=ZOb8QradixTWTwpWf81RpRplrFM%3D&Expires=1617902617')
        setTimeout(()=> {
          this.resultContent.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }, 20);


    }, (e: HttpErrorResponse) => {
      this.uiUtil.showMessage(e.message);
    });
  }

  private scrollToFirstInvalidControl() {
    const element: HTMLElement = this.el.nativeElement.querySelector("form .ng-invalid");

    this.sideNavContent.scrollTo({
      behavior: 'smooth',
      left: 0,
      top: element.parentElement!.offsetTop - 150
    });

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
  }

  range(range: number) {
    if (this.blueprint.floorAreas.length > range) {
      this.blueprint.floorAreas.splice(range);
    }

    return new Array(range);
  }

}

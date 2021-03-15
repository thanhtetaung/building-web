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
import { configuration } from '../../config/configuration';
import { Lightbox } from 'ngx-lightbox';

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

  useDistrictsMap : Map<string, string> = new Map<string, string>();
  specialRoadExistenceMap : Map<boolean, string> = new Map<boolean, string>();
  blueprintTypeMap : Map<string, string> = new Map<string, string>();


  @ViewChild('blueprintForm', {static: true}) blueprintForm!: NgForm;
  public uploadedResponses: Array<UploadResponse> = [];

  @ViewChild('resultContent')
  resultContent!: ElementRef;


  public fileControl = new FileUploadControl(FileUploadValidators.filesLimit(2)).setListVisibility(false);

  constructor(private buildingService: BuildingService, router: Router, uiUtil: UiUtil,
    location: Location, historyService: HistoryService,
    @Inject(DOCUMENT) private document: Document, private _lightbox: Lightbox) {
    super(uiUtil, router, location, historyService);

    // //dummy
    // let response = new UploadResponse();
    // let fileMeta = new FileMeta();
    // fileMeta.imageUrl = '';
    // response.fileMetas.push(fileMeta);
    // this.uploadedResponses.push(response);
  }

  ngOnInit(): void {
    this.specialRoadExistenceMap.set(true, "有");
    this.specialRoadExistenceMap.set(false, "無");
    this.useDistrictsMap.set("first_class_low_rise_residential_area", "第一種低層住居専用地域");
    this.useDistrictsMap.set("type_two_low_rise_residential_area", "第二種低層住居専用地域");
    this.useDistrictsMap.set("First_middle_high_rise_residential_area", "第一種中高層住居専用地域");
    this.useDistrictsMap.set("type_two_middle_high_rise_residential_area", "第二種中高層住居専用地域");
    this.useDistrictsMap.set("First_class_residential_area", "第一種住居地域");
    this.useDistrictsMap.set("type_two_class_residential_area", "第二種住居地域");
    this.useDistrictsMap.set("semi_residential_area", "準住居地域");
    this.useDistrictsMap.set("neighboring_commercial_area", "近隣商業地域");
    this.useDistrictsMap.set("commercial_area", "商業地域");
    this.useDistrictsMap.set("semi_industrial_area", "準工業地域");
    this.useDistrictsMap.set("industrial_area", "工業地域");
    this.useDistrictsMap.set("designated_industrial_area", "工業専用地域");
    this.blueprintTypeMap.set("layout_plan","配置図");
    this.blueprintTypeMap.set("area_table","面積表");
    this.blueprintTypeMap.set("floor_plan","平面図");
    this.blueprintTypeMap.set("elevation_plan","立面図");
    this.blueprintTypeMap.set("cross_section_plan","断面図");
    this.blueprintTypeMap.set("joinery_table","建具表");
    this.blueprintTypeMap.set("site_quadrature_plan","敷地求積図");
    this.blueprintTypeMap.set("guide_plan","案内図");
    this.blueprintTypeMap.set("finish_table","仕上表");
    this.blueprintTypeMap.set("lighting_calculation_table","採光算定表");
    this.blueprintTypeMap.set("sunshine_plan","日影図");
    this.blueprintTypeMap.set("air_conditioning_ventilation_sanitation_equipment_plan","空調換気衛生設備図");
    this.blueprintTypeMap.set("construction_plan","構造図");
    this.blueprintTypeMap.set("electrical_equipment_plan","電気設備図");

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

    })
  }

  imageUrl(relativePath: string) {
    return configuration.baseUrl + relativePath + '?access_token=' + localStorage.getItem('accessToken');
  }

  submit() {
    if (this.blueprintForm.invalid || this.uploadedResponses.length === 0) {
      return;
    }
    this.blueprint.files = this.uploadedResponses.map(response => configuration.baseUrl + response.path);
    this.blueprint.fileMetaInfos = this.uploadedResponses.map(response => response.fileMetaInfos.filter(meta => meta.include === true))
    this.buildingService.blueprintAnalysis(this.blueprint)
      .subscribe((res) => {
        this.result = res;
        setTimeout(()=> {
          this.resultContent.nativeElement.scrollIntoView();
        }, 500);


    }, (e: HttpErrorResponse) => {
      this.uiUtil.showMessage(e.message);
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

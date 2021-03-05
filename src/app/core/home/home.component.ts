import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
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

  @ViewChild('blueprintForm', {static: true}) blueprintForm!: NgForm;
  public uploadedResponses: Array<UploadResponse> = [];

  public fileControl = new FileUploadControl(FileUploadValidators.filesLimit(2)).setListVisibility(false);

  constructor(private buildingService: BuildingService, router: Router, uiUtil: UiUtil,
    location: Location, historyService: HistoryService) {
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
            response.fileMetas = response.imageList.map((img) => {
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
    this.blueprint.files = this.uploadedResponses.map(response => response.path);
    this.blueprint.fileMetas = this.uploadedResponses.map(response => response.fileMetas.filter(meta => meta.include === true))
    this.buildingService.blueprintAnalysis(this.blueprint)
      .subscribe((res) => {
        this.result = res;
        console.log(res);
    }, (e: HttpErrorResponse) => {
      this.uiUtil.showMessage(e.message);
    });
  }

  trackByIndex(index: number, object: any) {
    return index;
  }

}

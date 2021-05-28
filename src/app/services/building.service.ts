import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { configuration } from '../config/configuration';
import { Blueprint } from '../models/blueprint';
import { BlueprintAnalysisResponse } from '../models/blueprint-analysis-response';
import { UploadResponse } from '../models/upload-response';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  constructor(private http: HttpClient){};

  upload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadResponse>(
      environment.baseUrl + 'v1/uploadDesign',
      formData,
      {
        reportProgress: true,
        observe: 'events'
      }
    ).pipe(map((event) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          const progress = Math.round(100 * event.loaded / event.total!);
          return { status: 'progress', progress: progress };
        case HttpEventType.Response:
          let response = new UploadResponse();
          response.imageList = event.body!.imageList;
          response.path = event.body!.path;
          response.mediaType = event.body!.mediaType;
          return response;
        default:
          return `Unhandled event: ${event.type}`;
      }
    }));

  }

  blueprintAnalysis(blueprint: Blueprint): Observable<BlueprintAnalysisResponse> {
    return this.http.post<BlueprintAnalysisResponse>(environment.baseUrl + 'v1/blueprintAnalysis', blueprint);
  }
}

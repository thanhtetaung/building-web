import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { configuration } from '../config/configuration';;

export class WebserviceInterceptor implements HttpInterceptor {

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let headers: { [key: string]: string } = {
      'Content-Type': configuration.contentType,
      'Accept': configuration.accept
    };

    if (localStorage.getItem('accessToken') != null && localStorage.getItem('accessToken')) {
      headers['Authorization'] = 'Bearer ' + localStorage.getItem('accessToken');
    }

    req = req.clone({
      setHeaders: headers,
    });

    return next.handle(req);
  }
}

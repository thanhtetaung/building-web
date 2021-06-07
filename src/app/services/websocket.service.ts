import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { environment } from 'src/environments/environment';

export class WebsocketService {

  url!: string;
  subject!: WebSocketSubject<any>;

  connect(): WebSocketSubject<any> {
    this.subject = webSocket( environment.webSocketBaseUrl + 'event-emitter?access_token=' + localStorage.getItem('accessToken'));
    return this.subject;
  }


  next(message: any) {
    this.subject.next(JSON.stringify(message));
  }

  close() {
    this.subject.complete();
  }
}

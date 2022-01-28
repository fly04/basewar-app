import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { GeolocationService } from './services/geolocation.service';
import { AuthService } from './auth/auth.service';
import { WebsocketService } from './services/websocket/websocket.service';
import { LocalNotificationService } from './services/local-notification.service';
import { WsMessagesService } from './services/websocket/ws-messages.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  currentPosition: {
    lat: number;
    lng: number;
  };
  constructor(
    storage: Storage,
    readonly geolocService: GeolocationService,
    readonly websocketService: WebsocketService,
    readonly wsMessagesService: WsMessagesService,
    readonly localNotificationService: LocalNotificationService
  ) {
    storage.create();

    setInterval(() => {
      geolocService.getCurrentPosition().then((position) => {
        storage.get('auth').then((data) => {
          let lng = position.coords.longitude;
          let lat = position.coords.latitude;
          let wsMessage = {
            command: 'updateLocation',
            userId: data.user.id,
            location: {
              type: 'Point',
              coordinates: [lat, lng],
            },
          };
          websocketService.send(wsMessage);
        });
      });
    }, 5000);

    this.localNotificationService.checkNotificationsPermissions();
    this.wsMessagesService.visitorNotification$.subscribe((data) => {
      this.localNotificationService.createNotification(
        'Vous avez de la visite!',
        `Un visiteur est entré dans votre base ${data.baseName}`,
        Date.now()
      );
    });
  }
}

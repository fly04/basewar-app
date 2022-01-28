import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root',
})
export class LocalNotificationService {
  constructor() {}

  async showLocalNotification() {
    console.log('Notification!');

    await LocalNotifications.requestPermissions();

    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Hello',
          body: 'Hello world!',
          id: 1,
          //   schedule: { at: new Date(Date.now() + 1000) },
        },
      ],
    }).then((res) => {
      console.log(res);
    });
  }
}

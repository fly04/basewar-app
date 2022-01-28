import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root',
})
export class LocalNotificationService {
  isPermitted: boolean;

  constructor() {
    //Montre que la notification semble bien fonctionner sur mobile
    // LocalNotifications.addListener(
    //   'localNotificationReceived',
    //   (notification) => {
    //     console.log(notification);
    //   }
    // );
  }

  async checkNotificationsPermissions() {
    await LocalNotifications.checkPermissions().then(async (permissions) => {
      if (permissions.display != 'granted') {
        await LocalNotifications.requestPermissions().then(
          async (requestedPermission) => {
            if (requestedPermission.display == 'denied') {
              this.isPermitted = false;
            } else if (requestedPermission.display == 'granted') {
              this.isPermitted = true;
            }
          }
        );
      } else if (permissions.display != 'granted') {
        this.isPermitted = true;
      }
    });
  }

  async createNotification(title, body, id) {
    if (!this.isPermitted) return;
    await LocalNotifications.schedule({
      notifications: [
        {
          title: title,
          body: body,
          id: id,
        },
      ],
    });
  }
}

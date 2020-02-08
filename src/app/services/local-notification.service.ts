import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationService {

  constructor( private localNotifications: LocalNotifications) { }

  enablePSNotif() {

    this.localNotifications.schedule({
      id: 1,
      title: 'SpotOnResponse',
      text: "App currently running in the background.",
      actions: 'stop',
      sticky: true
    });
    
  }

  clearAll() {
    this.localNotifications.clearAll();
  }
  
}

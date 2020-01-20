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
      title: 'Safety Net Enabled',
      text: 'Tap any volume button 3 times to get help immediately.',
      actions: 'stop',
      sticky: true
    });
    
  }

  clearAll() {
    this.localNotifications.clearAll();
  }
  
}

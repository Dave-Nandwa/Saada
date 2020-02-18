import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone
} from '@angular/core';
import {
  Platform,
  ModalController
} from '@ionic/angular';

import {
  Geolocation
} from '@ionic-native/geolocation/ngx';

import {
  GoogleMapsService
} from './../../services/google-maps.service';

import {
  styles
} from '../../../assets/mapStyles';
import { UtilitiesService } from 'src/app/services/utilities.service';

declare var google;

@Component({
  selector: 'app-location-select',
  templateUrl: './location-select.page.html',
  styleUrls: ['./location-select.page.scss'],
})
export class LocationSelectPage implements OnInit {
  //Map Variables
  mapStyles: any = styles;

  lat;
  lng;

  @ViewChild('map', {
    static: true
  }) mapElement: ElementRef;


  // autocompleteService: any;
  // placesService: any;
  // query: string = '';
  // places: any = [];
  // searchDisabled: boolean;
  saveDisabled: boolean = true;
  // location: any;
  zoomLevel: number = 8;
  mapIcon: any = {
    url: './assets/map/user_pin.svg',
    scaledSize: {
      width: 60,
      height: 60
    }
  }

  constructor(
    public zone: NgZone, 
    public maps: GoogleMapsService,
    public platform: Platform, 
    public geolocation: Geolocation, 
    public modalCtrl: ModalController,
    public utils: UtilitiesService) {}

  save() {
    this.modalCtrl.dismiss({
      lat: this.lat,
      lng: this.lng
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  placeMarker($event) {
    this.utils.presentToast('Address and Lat/Lng updated successfuly!', 'toast-success')
    this.saveDisabled = false;
    console.log("Lat: ", $event.coords.lat);
    console.log("Lng: ", $event.coords.lng);
    this.lat = ($event.coords.lat);
    this.lng = ($event.coords.lng);
  }


  ngOnInit() {
    console.log(this.lat);
  }

}
import { Injectable } from '@angular/core';


/* ---------------------------- Native Providers ---------------------------- */


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  lat: any = -1.307305;
  lng: any = 36.911091;

  constructor() { }


  
  randomGeo(radius) {
    var y0 = this.lat;
    var x0 = this.lng;
    var rd = radius / 111300;

    var u = Math.random();
    var v = Math.random();

    var w = rd * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);

    // var xp = x / Math.cos(y0);

    return {
      'latitude': y + y0,
      'longitude': x + x0
    };
  }

}

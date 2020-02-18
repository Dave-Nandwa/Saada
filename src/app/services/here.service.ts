import {
  Injectable
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';

declare var H: any;

@Injectable({
  providedIn: 'root'
})
export class HereService {

  public platform: any;
  public geocoder: any;

  public constructor(private http: HttpClient) {
    this.platform = new H.service.Platform({
      "app_id": "X7ALiO70vO0qKG0BWUvj",
      "app_code": "nHTGSRRKtiiklYi-L7jm-s9JkKWTyk2foTsVmyh1yI8",
      "apiKey": "0_27jhcFxJCyHS-mvu_oIrA4lcBpr57XfhOSCZ1wGbg"
    });
    this.geocoder = this.platform.getGeocodingService();
  }

  public getAddress(query: string) {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({
        searchText: query
      }, result => {
        if (result.Response.View.length > 0) {
          if (result.Response.View[0].Result.length > 0) {
            resolve(result.Response.View[0].Result);
          } else {
            reject({
              message: "no results found"
            });
          }
        } else {
          reject({
            message: "no results found"
          });
        }
      }, error => {
        reject(error);
      });
    });
  }

  public getAddressFromLatLng(query: string) {
    return new Promise((resolve, reject) => {
      this.geocoder.reverseGeocode({
        prox: query,
        mode: "retrieveAddress"
      }, result => {
        if (result.Response.View.length > 0) {
          if (result.Response.View[0].Result.length > 0) {
            resolve(result.Response.View[0].Result);
          } else {
            reject({
              message: "no results found"
            });
          }
        } else {
          reject({
            message: "no results found"
          });
        }
      }, error => {
        reject(error);
      });
    });
  }

  revGeo(latLng) {
    var mode = "retrieveAddresses";
    var maxRes = "1";
    var apiKey = "0_27jhcFxJCyHS-mvu_oIrA4lcBpr57XfhOSCZ1wGbg";
    var url = `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=${apiKey}&mode=${mode}&maxresults=${maxRes}&additionaldata=IncludeShapeLevel%2CpostalCode&prox=${latLng}`;
    return this.http.get(url);
  }

}
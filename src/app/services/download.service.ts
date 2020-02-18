import {
  Injectable
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor() {}


  flattenObject(ob, prefix) {
    const toReturn = {};
    prefix = prefix ? prefix + '.' : '';

    for (let i in ob) {
      if (!ob.hasOwnProperty(i)) continue;

      if (typeof ob[i] === 'object' && ob[i] !== null) {
        // Recursion on deeper objects
        Object.assign(toReturn, this.flattenObject(ob[i], prefix + i));
      } else {
        toReturn[prefix + i] = ob[i];
      }
    }
    return toReturn;
  }


  downloadFile(fname, arr) {

    /* ------------------------------- Format JSON ------------------------------ */

    let csvData = [];

    /* -------------------------------------------------------------------------- */
    /*                      Flatten Every Object in the Array                     */
    /* -------------------------------------------------------------------------- */

    arr.map((obj) => csvData.push(this.flattenObject(obj, '')));

    /* -------------------------------------------------------------------------- */
    /*                      Format Fields that contain commas                     */
    /* -------------------------------------------------------------------------- */

    let formattedData = csvData.forEach((field) => {
      field.address = field.address.replace(/,/g, '/');
      field.when = field.when.replace(/,/g, '/');
      // field.position = '[APP FEATURE]';
      // field.formData = '[APP FEATURE]';
    });

    /* ------------------------------- Set Header ------------------------------- */

    let fileName = `${fname}.csv`;
    let columnNames = Object.keys(csvData[0]);
    // for (let i = 0; i < 2; i++) columnNames.pop();

    let header = columnNames.join(',');
    let mapped = [];
    let headers: any = [];
    columnNames.map((c: any, index) => {
      headers.push({
        [c]: c
      });
    });


    /* -------------------------------------------------------------------------- */
    /*            Remove Commas From all Value Properties of the object           */
    /* -------------------------------------------------------------------------- */

    csvData.map((obj, ind) => {
      for (const property in obj) {
        if (typeof(obj[property] === 'string')) {
          obj[property] = obj[property].toString().replace(/,/g, '/');
        }
      }
    });

    headers = Object.assign.apply(Object, headers);
    if (headers) {
      csvData.unshift(headers);
    }

    /* ----------------------------- Convert to CSV ----------------------------- */

    var csv = this.convertToCSV(csvData);


    var blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });

    /* -------------------------------- Download -------------------------------- */

    var link = document.createElement("a");
    if (link.download !== undefined) {
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','

        line += array[i][index];
      }

      str += line + '\r\n';
    }

    return str;
  }

  

}
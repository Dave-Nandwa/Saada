import {
  LocationSelectPage
} from './../../modals/location-select/location-select.page';
import {
  FormService
} from './../../services/form.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import {
  FormlyFieldConfig
} from '@ngx-formly/core';
import {
  UtilitiesService
} from 'src/app/services/utilities.service';
import {
  UserService
} from 'src/app/services/user.service';
import {
  Router
} from '@angular/router';
import {
  Geolocation
} from '@ionic-native/geolocation/ngx';
import {
  HereService
} from 'src/app/services/here.service';



@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.page.html',
  styleUrls: ['./create-form.page.scss'],
})
export class CreateFormPage implements OnInit {

  createForm = new FormGroup({
    type: new FormControl('None', [Validators.required]),
  });

  form = new FormGroup({});
  model = {
    email: 'email@gmail.com'
  };
  fields: FormlyFieldConfig[] = [];
  inputType: any;
  @ViewChild("myDiv", {
    static: true
  }) formView: ElementRef;

  inputOptions: any = ["Text", "Checkbox", "Textarea", "Dropdown", "Radio"];
  opt: any;


  sioi: boolean = false;

  userData: any;
  segment: any = 'form';


  lat: any = 0.0;
  lng: any = 0.0;
  locations: any;

  physicalAddr: any = {
    Address: 'None',
    City: 'None',
    District: 'None',
    State: 'None',
    postalCode: 'N/A',
    Lat: 0,
    Lng: 0
  };

  geocodedData: any;


  constructor(
    private elRef: ElementRef,
    private utils: UtilitiesService,
    private formService: FormService,
    private userService: UserService,
    private router: Router,
    private geolocation: Geolocation,
    private here: HereService) {}

  ngOnInit() {
    this.getUserData();
    this.getLatLng();
  }

  // compareWithFn = (o1, o2) => {
  //   console.log(o1, o2);
  //   console.log(o1 && o2 ? o1.id === o2.id : o1 === o2);
  //   return o1 && o2 ? o1.id === o2.id : o1 === o2;
  // };

  // compareWith = this.compareWithFn;

  toggleCheckbox() {
    this.sioi = this.sioi === false ? true : false;
    console.log(this.sioi);
  }


  getUserData() {
    this.utils.presentLoading('Please wait...');
    this.userService.getUserProfile().then((userProfileSnapshot: any) => {
      console.log(userProfileSnapshot);
      if (userProfileSnapshot.data()) {
        this.userData = userProfileSnapshot.data();
      }
      this.utils.dismissLoading();
    }).catch((err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    });
  }


  submit(model) {
    console.log(model);
  }

  onTypeChange() {
    let choice = this.createForm.get('type').value;
    this.inputType = choice;
    this.evalChoice(choice);
    this.opt = 'Select';
  }


  /* -------------------------------------------------------------------------- */
  /*                       Geolocation and Native Geocoder                      */
  /* -------------------------------------------------------------------------- */

  async getLatLng() {
    console.log('Ran');
    // const cars = this.afs.collection('cars');
    this.geolocation.getCurrentPosition().then(async (resp) => {
      //Store Latitude and Longitude
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      //Chain Observable to User's location
      this.getPhysicalAddress();
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }


  /* ------------------------------ HERE API Service ------------------------------ */
  // This is if the user is using the app on the web
  getPhysicalAddress() {
    if (this.lat && this.lng) {
      console.log(JSON.stringify(this.lat) + "," + JSON.stringify(this.lng))
      let geoSub = this.here.revGeo(JSON.stringify(this.lat) + "," + JSON.stringify(this.lng)).subscribe((res: any) => {
        if ((res.Response.View[0].Result.length > 0)) {
          this.geocodedData = res.Response.View[0].Result;
          let pa = res.Response.View[0].Result[0].Location.Address;
          this.physicalAddr = {
            Address: pa.Label,
            City: pa.City,
            State: pa.State,
            District: pa.District,
            Country: pa.AdditionalData[0].value,
            Lat: this.lat,
            Lng: this.lng,
            postalCode: pa.PostalCode ? pa.PostalCode : 'N/A'
          }
          console.log(res.Response.View[0].Result);
        } else {
          console.log('HERE api returned no results.');
        }
        geoSub.unsubscribe();
      });
    } else {
      console.log('Latitude and Longitude not Received.');
    }
  }


  /* -------------------------------------------------------------------------- */
  /*                      When Items in List are Reordered                      */
  /* -------------------------------------------------------------------------- */

  //Toggle Reorder Capability after they are enough fields
  toggleReorder() {
    console.log('Toggled!');
    const reorderGroup: any = document.getElementById('items');
    reorderGroup.disabled = !reorderGroup.disabled;
    reorderGroup.addEventListener('ionItemReorder', (e) => {
      console.log(e);
      this.onReorderItems(e);
    });
  }


  onReorderItems(event) {
    console.log(`Moving item from ${event.detail.from} to ${event.detail.to}`);
    let draggedItem = this.fields.splice(event.detail.from, 1)[0];
    this.fields.splice(event.detail.to, 0, draggedItem)
    //this.listItems = reorderArray(this.listItems, event.detail.from, event.detail.to);
    event.detail.complete();
  }

  evalChoice(c) {
    this.opt = 'Add Field';
    switch (c) {
      case "Text":
        this.createInput();
        this.opt = 'Add Field';
        break;
      case "Checkbox":
        this.createCheckbox();
        this.opt = 'Add Field';
        break;
      case "Dropdown":
        this.createDropdown();
        this.opt = 'Add Field';
        break;
      case "Radio":
        this.createRadio();
        this.opt = 'Add Field';
        break;
      case "Textarea":
        this.createTextarea();
        this.opt = 'Add Field';
        break;
    }
  }


  /* -------------------------------------------------------------------------- */
  /*                             Naked Form Builder                             */
  /* -------------------------------------------------------------------------- */


  /* ------------------------------- Input Text ------------------------------- */

  createInput() {
    this.formView.nativeElement.innerHTML = `
    <ion-item lines="none">
    <ion-label>Label: </ion-label>
    <ion-input type="text" placeholder="Enter Here" name="label" >
    </ion-input>
    </ion-item>
    <ion-item lines="none">
    <ion-label>Placeholder: </ion-label>
    <ion-input type="text" placeholder="Enter Here" name="placeholder" >
    </ion-input>
    </ion-item>
    <ion-button type="submit" class="ion-padding save">Save</ion-button>
    `;
    this.elRef.nativeElement.querySelector('.save').addEventListener('click', this.addInputToSchema.bind(this));
  }

  addInputToSchema() {
    let label = ( < HTMLInputElement > document.querySelector('input[name=label]')).value;
    let placeholder = ( < HTMLInputElement > document.querySelector('input[name=placeholder]')).value;
    this.fields.push({
      key: this.capitalize(label.toLowerCase().trim()),
      type: 'input',
      templateOptions: {
        label: label,
        placeholder: placeholder,
        required: true,
      }
    });
    this.formView.nativeElement.innerHTML = "";
    this.utils.presentToast('Added Input Successfully', 'toast-success');
  }


  /* ------------------------------- Textarea ------------------------------- */

  createTextarea() {
    this.formView.nativeElement.innerHTML = `
    <ion-item lines="none">
    <ion-label>Label: </ion-label>
    <ion-input type="text" placeholder="Enter Here" name="label" >
    </ion-input>
    </ion-item>
    <ion-item lines="none">
    <ion-label>Placeholder: </ion-label>
    <ion-input type="text" placeholder="Enter Here" name="placeholder" >
    </ion-input>
    </ion-item>
    <ion-button type="submit" class="ion-padding save">Save</ion-button>
    `;
    this.elRef.nativeElement.querySelector('.save').addEventListener('click', this.addTextareaToSchema.bind(this));
  }

  addTextareaToSchema() {
    let label = ( < HTMLInputElement > document.querySelector('input[name=label]')).value;
    let placeholder = ( < HTMLInputElement > document.querySelector('input[name=placeholder]')).value;
    this.fields.push({
      key: this.capitalize(label.toLowerCase().trim()),
      type: 'textarea',
      templateOptions: {
        label: label,
        placeholder: placeholder,
        required: true,
      }
    });
    this.formView.nativeElement.innerHTML = "";
    this.utils.presentToast('Added Textarea Successfully', 'toast-success');
  }



  /* -------------------------------- Checkbox -------------------------------- */


  createCheckbox() {
    this.formView.nativeElement.innerHTML = `
    <ion-item>
    <ion-label>Label: </ion-label>
    <ion-input type="text" placeholder="Enter Checkbox Top Label Here" name="label" >
    </ion-input>
    </ion-item>
    <ion-item lines="none">
    <ion-label>Number of Checkboxes: </ion-label>
    <ion-input type="number" placeholder="Enter Here" name="num" >
    </ion-input>
    </ion-item>
    <ion-button type="submit" class="ion-padding next">Next</ion-button>
    `;
    this.elRef.nativeElement.querySelector('.next').addEventListener('click', this.addInputsForCheckbox.bind(this));
  }

  addInputsForCheckbox() {
    let label = ( < HTMLInputElement > document.querySelector('input[name=label]')).value;
    let numOfOptions = ( < HTMLInputElement > document.querySelector('input[name=num]')).value;
    this.formView.nativeElement.innerHTML = ``;
    for (let i = 0; i < parseInt(numOfOptions); i++) {
      this.formView.nativeElement.innerHTML += (`
      <ion-item lines="none">
      <ion-label>Checkbox ${i+1}: </ion-label>
      <ion-input type="text" placeholder="Label Here" name="label${i+1}">
      </ion-input>
      </ion-item>`);
      console.log('Added.')
    }
    this.formView.nativeElement.innerHTML += (`<ion-button type="submit" class="ion-padding save">Save</ion-button>`);
    this.elRef.nativeElement.querySelector('.save').addEventListener('click', this.addCheckboxesToSchema.bind(this, numOfOptions, label));
  }

  addCheckboxesToSchema(numOfOptions, label) {
    let opts = [];
    for (let i = 0; i < parseInt(numOfOptions); i++) {
      let opt = ( < HTMLInputElement > document.querySelector(`input[name=label${i+1}]`)).value;
      opts.push({
        key: opt,
        value: this.capitalize(opt),
      });
    }

    /* -------------------------- Add it to the Schema -------------------------- */
    this.fields.push({
      "type": "multicheckbox",
      "key": this.capitalize(label).trim(),
      "templateOptions": {
        "options": opts,
        "label": label
      }
    });


    // opts.map((opt) => {
    //   this.fields.push({
    //     key: this.capitalize(opt.label.toLowerCase().trim()),
    //     type: 'checkbox',
    //     templateOptions: {
    //       label: opt.label,
    //     }
    //   })
    // });
    this.formView.nativeElement.innerHTML = "";
    this.utils.presentToast('Added Checkbox Successfully.', 'toast-success');
  }

  /* 

    createCheckbox() {
      this.formView.nativeElement.innerHTML = `
      <ion-item lines="none">
      <ion-label>Label: </ion-label>
      <ion-input type="text" placeholder="Enter Here" name="label" >
      </ion-input>
      </ion-item>
      <ion-button type="submit" (tap)="addInputToSchema()" class="ion-padding save">Save</ion-button>
      `;
      this.elRef.nativeElement.querySelector('.save').addEventListener('click', this.addCheckboxToSchema.bind(this));
    }

    addCheckboxToSchema() {
      let label = ( < HTMLInputElement > document.querySelector('input[name=label]')).value;
      this.fields.push({
        key: this.capitalize(label.toLowerCase().trim()),
        type: 'checkbox',
        templateOptions: {
          label: label,
        }
      });
      this.formView.nativeElement.innerHTML = "";
      this.utils.presentToast('Added Checkbox Successfuly.', 'toast-success');
    } */

  /* -------------------------------- Dropdown -------------------------------- */

  createDropdown() {
    this.formView.nativeElement.innerHTML = `
    <ion-item lines="none">
    <ion-label>Label: </ion-label>
    <ion-input type="text" placeholder="Enter Here" name="label" >
    </ion-input>
    </ion-item>
    <ion-item lines="none">
    <ion-label>Placeholder: </ion-label>
    <ion-input type="text" placeholder="Enter Here" name="placeholder" >
    </ion-input>
    </ion-item>
    <ion-item lines="none">
    <ion-label>Number of Options: </ion-label>
    <ion-input type="number" placeholder="Enter Here" name="num" >
    </ion-input>
    </ion-item>
    <ion-button type="submit" class="ion-padding next">Next</ion-button>
    `;
    this.elRef.nativeElement.querySelector('.next').addEventListener('click', this.addInputsForDropdown.bind(this));
  }

  addInputsForDropdown() {
    let label = ( < HTMLInputElement > document.querySelector('input[name=label]')).value;
    let placeholder = ( < HTMLInputElement > document.querySelector('input[name=placeholder]')).value;
    let numOfOptions = ( < HTMLInputElement > document.querySelector('input[name=num]')).value;
    this.formView.nativeElement.innerHTML = ``;
    for (let i = 0; i < parseInt(numOfOptions); i++) {
      this.formView.nativeElement.innerHTML += (`
      <ion-item lines="none">
      <ion-label>Option ${i+1}: </ion-label>
      <ion-input type="text" placeholder="Enter Here" name="label${i+1}">
      </ion-input>
      </ion-item>`);
      console.log('Added.')
    }
    this.formView.nativeElement.innerHTML += (`<ion-button type="submit" class="ion-padding save">Save</ion-button>`);
    this.elRef.nativeElement.querySelector('.save').addEventListener('click', this.addDropdownToSchema.bind(this, label, placeholder, numOfOptions));
  }

  addDropdownToSchema(label, placeholder, numOfOptions) {
    let opts = [];
    for (let i = 0; i < parseInt(numOfOptions); i++) {
      let opt = ( < HTMLInputElement > document.querySelector(`input[name=label${i+1}]`)).value;
      opts.push({
        label: opt,
        value: opt
      });
    }

    /* -------------------------- Add it to the Schema -------------------------- */

    this.fields.push({
      key: this.capitalize(label.toLowerCase().trim()),
      type: 'select',
      templateOptions: {
        label: label,
        placeholder: placeholder,
        required: true,
        options: opts
      }
    });
    this.formView.nativeElement.innerHTML = "";
    this.utils.presentToast('Added Dropdown Successfully.', 'toast-success');
  }







  /* -------------------------------- Radio -------------------------------- */

  createRadio() {
    this.formView.nativeElement.innerHTML = `
    <ion-item lines="none">
    <ion-label>Label: </ion-label>
    <ion-input type="text" placeholder="Enter Radio Label Here" name="label" >
    </ion-input>
    </ion-item>
    <ion-item lines="none">
    <ion-label>Placeholder: </ion-label>
    <ion-input type="text" placeholder="Enter Here" name="placeholder" >
    </ion-input>
    </ion-item>
    <ion-item lines="none">
    <ion-label>Number of Options: </ion-label>
    <ion-input type="number" placeholder="Enter Here" name="num" >
    </ion-input>
    </ion-item>
    <ion-button type="submit" class="ion-padding next">Next</ion-button>
    `;
    this.elRef.nativeElement.querySelector('.next').addEventListener('click', this.addOptionsForRadio.bind(this));
  }

  addOptionsForRadio() {
    let label = ( < HTMLInputElement > document.querySelector('input[name=label]')).value;
    let placeholder = ( < HTMLInputElement > document.querySelector('input[name=placeholder]')).value;
    let numOfOptions = ( < HTMLInputElement > document.querySelector('input[name=num]')).value;
    this.formView.nativeElement.innerHTML = ``;
    for (let i = 0; i < parseInt(numOfOptions); i++) {
      this.formView.nativeElement.innerHTML += (`
      <ion-item lines="none">
      <ion-label>Option ${i+1}: </ion-label>
      <ion-input type="text" placeholder="Enter Here" name="label${i+1}" >
      </ion-input>
      </ion-item>`);
      console.log('Added.')
    }
    this.formView.nativeElement.innerHTML += (`<ion-button type="submit" class="ion-padding save">Save</ion-button>`);
    this.elRef.nativeElement.querySelector('.save').addEventListener('click', this.addRadioToSchema.bind(this, label, placeholder, numOfOptions));
  }

  addRadioToSchema(label, placeholder, numOfOptions) {
    let opts = [];
    for (let i = 0; i < parseInt(numOfOptions); i++) {
      let opt = ( < HTMLInputElement > document.querySelector(`input[name=label${i+1}]`)).value;
      opts.push({
        label: opt,
        value: opt
      });
    }

    /* -------------------------- Add it to the Schema -------------------------- */

    this.fields.push({
      key: this.capitalize(label.toLowerCase().trim()),
      type: 'radio',
      templateOptions: {
        label: label,
        placeholder: placeholder,
        required: true,
        options: opts
      }
    });
    this.formView.nativeElement.innerHTML = "";
    this.utils.presentToast('Added Radios Successfully.', 'toast-success');
  }


  uploadForm() {
    var dateTime = new Date().toLocaleString();
    this.formService.uploadNakedForm({
      nakedForm: JSON.stringify(this.fields),
      formName: ( < HTMLInputElement > document.querySelector('input[name=form_name]')).value,
      createdBy: `${this.userData.fullName} (${this.userData.email})`,
      when: dateTime,
      userId: this.userData.userId,
      organization: this.userData.organization,
      division: this.userData.division,
      project: this.userData.project,
      orgId: this.userData.orgId,
      sioi: this.sioi,
      status: 'ok',
      address: {
        ...this.physicalAddr
      }
    }).then(() => {
      this.utils.presentAlert('Success', '', 'Your Custom Form was uploaded successfully and can now be used by all the users within this project.');
      this.router.navigate(['tabs/profile']);
    }).catch((err) => {
      this.utils.handleError(err);
    });
  }

  /*   async launchLocationPage() {

      const modal = await this.modalCtrl.create({
        component: LocationSelectPage,

      });

      modal.onDidDismiss().then((resp: any) => {
        if (resp.data !== 'None') {
          console.log(resp.data);
        } else {
          console.log('Modal Dismissed.')
        }
      });

      return await modal.present();

    }
   */

  /* ---------------------------- Utility Functions --------------------------- */

  capitalize(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }




}
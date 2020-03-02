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
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';

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

import {
  FormArray,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import {
  FormlyFormOptions,
  FormlyFieldConfig
} from '@ngx-formly/core';
import {
  AlertController
} from '@ionic/angular';


export interface StepType {
  label: string;
  fields: FormlyFieldConfig[];
}


@Component({
  selector: 'app-step-form',
  templateUrl: './step-form.page.html',
  styleUrls: ['./step-form.page.scss'],
})
export class StepFormPage implements OnInit {
  activeStep = 0;

  model = {};
  createForm = new FormGroup({
    type: new FormControl('None', [Validators.required]),
  });

  steps: StepType[] = [{
      label: 'Personal data',
      fields: [{
          key: 'firstname',
          type: 'input',
          templateOptions: {
            label: 'First name'
          },
        },
        {
          key: 'age',
          type: 'input',
          templateOptions: {
            type: 'number',
            label: 'Age',
          },
        },
      ],
    },
    {
      label: 'Destination',
      fields: [{
        key: 'country',
        type: 'input',
        templateOptions: {
          label: 'Country',
        },
      }, ],
    },
    {
      label: 'Day of the trip',
      fields: [{
        key: 'day',
        type: 'input',
        templateOptions: {
          type: 'date',
          label: 'Day of the trip'
        },
      }, ],
    },
  ];

  dynamicForm: StepType[] = [];

  form = new FormArray(this.steps.map(() => new FormGroup({})));


  options = this.steps.map(() => < FormlyFormOptions > {});
  fields: FormlyFieldConfig[] = [];
  inputType: any;
  @ViewChild("myDiv", {
    static: true
  }) formView: ElementRef;


  sioi: boolean = false;

  userData: any;
  segment: any = 'form';


  lat: any = 0.0;
  lng: any = 0.0;
  locations: any;

  toggled: boolean = false;

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
  currentTab: string = '';
  currentTabObject: any;
  selectedTabIndex: number = 0;
  tabs: any = [];

  // Input Options
  inputOptions: any = ["Text", "Instruction", "Checkbox", "Textarea", "Dropdown", "Radio"];
  opt: any = 'Select Input';


  constructor(
    private elRef: ElementRef,
    private utils: UtilitiesService,
    private formService: FormService,
    private userService: UserService,
    private router: Router,
    private geolocation: Geolocation,
    private here: HereService,
    private _changeDetectionRef: ChangeDetectorRef,
    private alertController: AlertController) {}

  ngOnInit() {
    this.getUserData();
    this.getLatLng();
  }



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


  prevStep(step) {
    this.activeStep = step - 1;
  }

  nextStep(step) {
    this.activeStep = step + 1;
  }

  //Add a Tab to the Form
  addTab() {
    let tabName = ( < HTMLInputElement > document.querySelector('input[name=tab_name]')).value;
    if (tabName.length >= 1) {
      ( < HTMLInputElement > document.querySelector('input[name=tab_name]')).value = '';
      this.currentTab = this.capitalize(tabName);
      //Push it to the tabs array for switching
      this.tabs.push(this.currentTab);
      this.dynamicForm.push({
        label: this.currentTab,
        fields: [],
      });
      this.currentTabObject = this.dynamicForm.find((obj: any) => {
        return obj.label === this.currentTab;
      });
      console.log('Added Tab');
    } else {
      ( < HTMLInputElement > document.querySelector('input[name=tab_name]')).value = '';
      this.utils.presentToast('ERROR: You are trying to add a blank tab.', 'toast-error')
    }

  }

  //Delete a Tab From the Form
  deleteTab() {
    this.dynamicForm.splice(this.dynamicForm.findIndex((obj: any) => obj.label === this.currentTab), 1)
  }

  async confirmDeleteTab() {

    const alert = await this.alertController.create({
      header: 'Confirm:',
      message: '<strong>Are you sure you would like to delete the current tab</strong>?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Cancelled!');
        }
      }, {
        text: 'Okay',
        handler: () => {
          this.deleteTab();
        }
      }]
    });

    await alert.present();

  }

  /* ---------------- Debug Function for testing adding to form ---------------- */
  addToTab() {
    console.log('Added Input To Tab');
    this.currentTabObject = this.dynamicForm.find((obj: any) => {
      return obj.label === this.currentTab;
    });
    this.currentTabObject.fields.push({
      key: 'firstname',
      type: 'input',
      templateOptions: {
        label: 'First name'
      },
    });
    this.form = new FormArray(this.dynamicForm.map(() => new FormGroup({})));
  }

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

  // Change Tab Object on this event
  tabChange(event) {
    console.log('Tab Changed!');
    console.log(event);
    console.log(this.currentTabObject);
    this.selectedTabIndex = event.selectedIndex;
    this.currentTabObject = this.dynamicForm.find((obj: any) => {
      return obj.label === this.tabs[this.selectedTabIndex];
    });
    console.log(this.currentTabObject);
  }

  //Debug Function
  triggerClick() {
    console.log(`Selected tab index: ${this.selectedTabIndex}`);
  }

  submit() {
    console.log(JSON.stringify(this.model));
  }


  onTypeChange() {
    let choice = this.createForm.get('type').value;
    this.inputType = choice;
    this.evalChoice(choice);
    this.opt = choice;
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
            City: pa.City ? pa.City : 'N/A',
            State: pa.State ? pa.State : 'N/A',
            District: pa.District ? pa.District : 'N/A',
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

  onReorderItems(event) {
    console.log(`Moving item from ${event.detail.from} to ${event.detail.to}`);
    let draggedItem = this.currentTabObject.fields.splice(event.detail.from, 1)[0];
    this.currentTabObject.fields.splice(event.detail.to, 0, draggedItem)
    //this.listItems = reorderArray(this.listItems, event.detail.from, event.detail.to);
    event.detail.complete();
  }





  evalChoice(c) {
    switch (c) {
      case "Text":
        this.createInput();
        this.opt = 'Text';
        break;
      case "Instruction":
        this.createInstruction();
        this.opt = 'Instruction';
        break;
      case "Checkbox":
        this.createCheckbox();
        this.opt = 'Checkbox';
        break;
      case "Dropdown":
        this.createDropdown();
        this.opt = 'Dropdown';
        break;
      case "Radio":
        this.createRadio();
        this.opt = 'Radio';
        break;
      case "Textarea":
        this.createTextarea();
        this.opt = 'Textarea';
        break;
    }
  }



  /* -------------------------------------------------------------------------- */
  /*                             Naked Form Builder                             */
  /* -------------------------------------------------------------------------- */


  /* --------------------------- Custom Instruction Header --------------------------- */

  createInstruction() {
    this.formView.nativeElement.innerHTML = `
    <ion-item lines="none">
    <ion-label>Label: </ion-label>
    <ion-input type="text" placeholder="Enter Here" name="label" >
    </ion-input>
    </ion-item>
    <ion-button type="submit" class="ion-padding save">Save</ion-button>
    `;
    this.elRef.nativeElement.querySelector('.save').addEventListener('click', this.addDescToSchema.bind(this));
  }

  addDescToSchema() {
    let label = ( < HTMLInputElement > document.querySelector('input[name=label]')).value;
    this.currentTabObject.fields.push({
      key: this.capitalize(label.toLowerCase()),
      type: 'instruction',
      templateOptions: {
        label: this.capitalize(label)
      }
    });
    this.formView.nativeElement.innerHTML = "";
    this.utils.presentToast('Added Instruction Successfully', 'toast-success');
    this.form = new FormArray(this.dynamicForm.map(() => new FormGroup({})));
    this._changeDetectionRef.detectChanges();
    this.opt = "Select Input";
  }

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
    this.currentTabObject.fields.push({
      key: this.capitalize(label.toLowerCase()),
      type: 'input',
      templateOptions: {
        label: this.capitalize(label) + ": ",
        placeholder: placeholder
      }
    });
    this.formView.nativeElement.innerHTML = "";
    this.utils.presentToast('Added Input Successfully', 'toast-success');
    this.form = new FormArray(this.dynamicForm.map(() => new FormGroup({})));
    this._changeDetectionRef.detectChanges();
    this.opt = "Select Input";
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
    this.currentTabObject.fields.push({
      key: this.capitalize(label.toLowerCase()),
      type: 'textarea',
      templateOptions: {
        label: this.capitalize(label) + ": ",
        placeholder: placeholder,
      }
    });
    this.formView.nativeElement.innerHTML = "";
    this.utils.presentToast('Added Textarea Successfully', 'toast-success');
    this.form = new FormArray(this.dynamicForm.map(() => new FormGroup({})));
    this._changeDetectionRef.detectChanges();
    this.opt = "Select Input";
  }



  /* -------------------------------- Checkbox -------------------------------- */


  createCheckbox() {
    this.formView.nativeElement.innerHTML = `
    <ion-item lines="none">
    <ion-label>Label: </ion-label>
    <ion-input type="text" placeholder="Enter Checkbox Label Here" name="label" >
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
    let numOfOptions = ( < HTMLInputElement > document.querySelector('input[name=num]')).value;
    let label = ( < HTMLInputElement > document.querySelector('input[name=label]')).value;
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
      let option = ( < HTMLInputElement > document.querySelector(`input[name=label${i+1}]`)).value;
      opts.push({
        key: option,
        value: this.capitalize(option.toLowerCase()),
      });
      this.opt = "Select Input";
    }


    /* -------------------------- Add it to the Schema -------------------------- */
    this.currentTabObject.fields.push({
      key: this.capitalize(label).trim(),
      type: 'multicheckbox',
      templateOptions: {
        "options": opts,
        "label": this.capitalize(label) + ": "
      }
    });
    // opts.map((opt) => {
    //   this.currentTabObject.fields.push({
    //     key: this.capitalize(opt.label.toLowerCase().trim()),
    //     type: 'checkbox',
    //     templateOptions: {
    //       label: opt.label,
    //     }
    //   })
    // });
    this.formView.nativeElement.innerHTML = "";
    this.utils.presentToast('Added Checkbox Successfully.', 'toast-success');
    this.form = new FormArray(this.dynamicForm.map(() => new FormGroup({})));
    this._changeDetectionRef.detectChanges();
  }



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
      let option = ( < HTMLInputElement > document.querySelector(`input[name=label${i+1}]`)).value;
      opts.push({
        label: this.capitalize(option.toLowerCase()),
        value: this.capitalize(option.toLowerCase())
      });
      this.opt = "Select Input";
    }

    /* -------------------------- Add it to the Schema -------------------------- */

    this.currentTabObject.fields.push({
      key: this.capitalize(label.toLowerCase()),
      type: 'select',
      templateOptions: {
        label: this.capitalize(label) + ": ",
        placeholder: this.capitalize(placeholder.toLowerCase()),
        options: opts
      }
    });
    this.formView.nativeElement.innerHTML = "";
    this.utils.presentToast('Added Dropdown Successfully.', 'toast-success');
    this.form = new FormArray(this.dynamicForm.map(() => new FormGroup({})));
    this._changeDetectionRef.detectChanges();
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
        label: this.capitalize(opt),
        value: this.capitalize(opt)
      });
    }

    /* -------------------------- Add it to the Schema -------------------------- */

    this.currentTabObject.fields.push({
      key: this.capitalize(label.toLowerCase()),
      type: 'radio',
      templateOptions: {
        label: this.capitalize(label) + ": ",
        placeholder: this.capitalize(placeholder.toLowerCase()),
        options: opts
      }
    });
    this.formView.nativeElement.innerHTML = "";
    this.utils.presentToast('Added Radios Successfully.', 'toast-success');
    this.form = new FormArray(this.dynamicForm.map(() => new FormGroup({})));
    this._changeDetectionRef.detectChanges();
    this.opt = "Select Input";
  }


  uploadForm() {
    var dateTime = new Date().toLocaleString();
    this.formService.uploadNakedForm({
      nakedForm: JSON.stringify(this.dynamicForm),
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
      onHomePage: false,
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


  /* ---------------------------- Utility Functions --------------------------- */

  capitalize(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }




}
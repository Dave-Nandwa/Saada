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
  ModalController
} from '@ionic/angular';


import * as firebaseApp from 'firebase/app';
import * as geofirex from 'geofirex';


export interface StepForm {
  label: string;
  fields: FormlyFieldConfig[];
}

@Component({
  selector: 'app-edit-tabs-ioi',
  templateUrl: './edit-tabs-ioi.page.html',
  styleUrls: ['./edit-tabs-ioi.page.scss'],
})
export class EditTabsIoiPage implements OnInit {

  selectedForm;
  userData;
  lat;
  lng;
  physicalAddr;

  currentTab: any = 'Select';
  currentTabObject: any;
  selectedTabIndex: number = 0;

  tabsArray: any = [];

  tabs: StepForm[] = [];
  form: any;
  inputType: any;
  @ViewChild("myDiv", {
    static: true
  }) formView: ElementRef;

  segment: any = 'form';

  // Input Options
  inputOptions: any = ["Text", "Instruction", "Checkbox", "Textarea", "Dropdown", "Radio"];
  opt: any = 'Select Input';

  /* -------------------------- FormBuilder Variables ------------------------- */
  createForm = new FormGroup({
    type: new FormControl('None', [Validators.required]),
  });

  geocodedData: any;
  geo = geofirex.init(firebaseApp);

  constructor(
    private elRef: ElementRef,
    private utils: UtilitiesService,
    private formService: FormService,
    private userService: UserService,
    private router: Router,
    private geolocation: Geolocation,
    private here: HereService,
    private _changeDetectionRef: ChangeDetectorRef,
    private modalCtrl: ModalController) {}

  ngOnInit() {
    this.tabs = < StepForm[] > JSON.parse(this.selectedForm.nakedForm);
    this.currentTab = this.tabs[0].label;
    this.setCurrentTabObject(this.currentTab);
    this.form = new FormArray(this.tabs.map(() => new FormGroup({})));
    this.getTabLabelsOnly();
  }



  //Add a Tab to the Form
  addTab() {
    let tabName = ( < HTMLInputElement > document.querySelector('input[name=tab_name]')).value;
    if (tabName.length >= 1) {
      ( < HTMLInputElement > document.querySelector('input[name=tab_name]')).value = '';
      this.currentTab = this.capitalize(tabName);
      //Push it to the tabs array for switching
      this.tabsArray.push(this.currentTab);
      this.tabs.push({
        label: this.currentTab,
        fields: [],
      });
      this.setCurrentTabObject(this.currentTab);
      console.log('Added Tab');
    } else {
      ( < HTMLInputElement > document.querySelector('input[name=tab_name]')).value = '';
      this.utils.presentToast('ERROR: You are trying to add a blank tab.', 'toast-error')
    }

  }

  //Delete a Tab From the Form
  deleteTab() {
    console.log('Deleted!');
    let oldTabIndex = (this.tabs.findIndex((obj: any) => obj.label === this.currentTab));
    this.tabs.splice(this.tabs.findIndex((obj: any) => obj.label === this.currentTab), 1);
    this.tabsArray = this.tabsArray.filter((tab) => tab !== this.currentTab);
    console.log(this.tabs.length);
    if (this.tabs.length >= 1) {
      this.currentTab = (oldTabIndex + 1) !== this.tabs.length ? this.tabs[(oldTabIndex + 1)] : this.tabs[(this.tabs.length - 1)];
      this.setCurrentTabObject(this.currentTab);
    } else {
      this.currentTab = "";
      this.currentTabObject = [];
    }
    this.form = new FormArray(this.tabs.map(() => new FormGroup({})));
    this._changeDetectionRef.detectChanges();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }


  updateForm() {
    var dateTime = new Date().toLocaleString();
    const position = this.geo.point(this.lat, this.lng);
    this.formService.updateNakedForm({
      nakedForm: JSON.stringify(this.tabs),
      formName: ( < HTMLInputElement > document.querySelector('ion-input[name=formName]')).value,
      position: position,
      /*       address: {
              ...this.physicalAddr
            }, */
      when: dateTime
    }, this.selectedForm.formId).then(() => {
      this.utils.presentAlert('Success!', '', 'Form Updated Successfully.').then(() => {
        this.modalCtrl.dismiss();
        this.router.navigateByUrl('/tabs/home');
      })
    }).catch((err) => {
      this.utils.handleError(err);
      console.log(err);
    });
    console.table(this.tabs);
  }

  deleteForm() {
    this.formService.deleteIoi(this.selectedForm.formId).then(() => {
      this.utils.presentToast('Form deleted Successfully!', 'toast-success');
      this.modalCtrl.dismiss();
    }).catch((err) => {
      this.utils.handleError(err);
    });
  }

  deleteField(key) {
    this.currentTabObject.fields.splice(this.currentTabObject.fields.findIndex(function (i) {
      return i.key === key;
    }), 1);
    console.log(this.currentTabObject.fields);
  }

  onTabChange(e) {
    // Change Tab Object Based on Selection 
    this.setCurrentTabObject(e.target.value);
  }

  segmentChanged(e) {
    this.segment = (e.detail.value);
  }

  async locationSelectModal() {

    const modal = await this.modalCtrl.create({
      component: LocationSelectPage,
      componentProps: {
        lat: this.lat,
        lng: this.lng
      }
    });

    modal.onDidDismiss().then((resp: any) => {
      if (resp.data) {
        this.lat = resp.data.lat;
        this.lng = resp.data.lng;
        this.getPhysicalAddressHereAPI();
      } else {
        console.log('Modal Dismissed.')
      }
    });

    return await modal.present();
  }

  getPhysicalAddressHereAPI() {
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
          this.utils.presentToast('UNEXPECTED ERROR: Cannot determine your location.', 'toast-error');
        }
        geoSub.unsubscribe();
      });
    } else {
      this.utils.presentToast('Latitude and Longitude not Received. Cannot Geocode.', 'toast-error');
    }
  }

  onReorderItems(event) {
    console.log(`Moving item from ${event.detail.from} to ${event.detail.to}`);
    let draggedItem = this.currentTabObject.fields.splice(event.detail.from, 1)[0];
    this.currentTabObject.fields.splice(event.detail.to, 0, draggedItem)
    //this.listItems = reorderArray(this.listItems, event.detail.from, event.detail.to);
    event.detail.complete();
  }

  getTabLabelsOnly() {
    //Map Through the Form Object And Push the Labels to an Array
    this.tabs.map(({
      label
    }) => {
      this.tabsArray.push(label);
    });
    // Set a Current Tab for Starters
    this.setCurrentTabObject(this.tabsArray[0]);
  }

  //Utility Function for Setting a Current Tab
  setCurrentTabObject(tabName) {
    this.currentTabObject = this.tabs.find((obj: any) => {
      return obj.label === tabName;
    });
  }



  /* -------------------------------------------------------------------------- */
  /*                                Form Builder                                */
  /* -------------------------------------------------------------------------- */


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


  /* -------------------------- For Input Type Select ------------------------- */

  onTypeChange() {
    let choice = this.createForm.get('type').value;
    this.inputType = choice;
    this.evalChoice(choice);
    this.opt = choice;
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
    this.form = new FormArray(this.tabs.map(() => new FormGroup({})));
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
    this.form = new FormArray(this.tabs.map(() => new FormGroup({})));
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
    this.form = new FormArray(this.tabs.map(() => new FormGroup({})));
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
        value: this.capitalize(option),
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
    this.form = new FormArray(this.tabs.map(() => new FormGroup({})));
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
        label: this.capitalize(option),
        value: this.capitalize(option)
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
    this.form = new FormArray(this.tabs.map(() => new FormGroup({})));
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
    this.form = new FormArray(this.tabs.map(() => new FormGroup({})));
    this._changeDetectionRef.detectChanges();
    this.opt = "Select Input";
  }

  /* ---------------------------- Utility Functions --------------------------- */

  capitalize(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

}
import {
    Component
} from '@angular/core';
import {
    FormGroup,
    FormControl,
    AbstractControl
} from '@angular/forms';
import {
    FieldType,
    FormlyFieldConfig
} from '@ngx-formly/core';
// import 'rxjs/add/operator/reduce';
@Component({
    selector: 'formly-field-description',
    template: `
        <ion-item-divider>
            <ion-label class="ion-text-wrap" color="primary">
            <b>{{ field.templateOptions.label }}</b>:
            </ion-label>
        </ion-item-divider>
    `,
    //For debugging: 
    // <br><pre>{{field | json}}</pre>
})
export class FormlyFieldDescription extends FieldType {

}
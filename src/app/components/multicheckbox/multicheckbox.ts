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
    selector: 'formly-field-multicheckbox',
    template: `
        <ion-list>
            <ion-list-header><b>{{ field.templateOptions.label }}:</b></ion-list-header>
            <ion-item style="margin-left: 25px!important;" *ngFor="let option of to.options">
                <ion-label>{{option.key}}</ion-label>
                <ion-checkbox slot="end" [value]="option.value" [formControl]="formControl.get(option.key)"></ion-checkbox>
            </ion-item>
        </ion-list>
    `,
    //For debugging: 
    // <br><pre>{{field | json}}</pre>
})
export class FormlyFieldMultiCheckbox extends FieldType {
    static createControl(model: any, field: FormlyFieldConfig): AbstractControl {
        let controlGroupConfig = field.templateOptions.options.reduce((previous, option) => {
            previous[option.key] = new FormControl(model ? model[option.key] : undefined);
            return previous;
        }, {});

        return new FormGroup(
            controlGroupConfig,
            field.validators ? field.validators.validation : undefined,
            field.asyncValidators ? field.asyncValidators.validation : undefined
        );
    }
}
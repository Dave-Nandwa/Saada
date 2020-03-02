import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StepFormPage } from './step-form.page';

describe('StepFormPage', () => {
  let component: StepFormPage;
  let fixture: ComponentFixture<StepFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StepFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

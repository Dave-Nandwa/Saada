import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateFormPage } from './create-form.page';

describe('CreateFormPage', () => {
  let component: CreateFormPage;
  let fixture: ComponentFixture<CreateFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

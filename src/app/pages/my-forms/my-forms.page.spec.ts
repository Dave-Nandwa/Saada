import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyFormsPage } from './my-forms.page';

describe('MyFormsPage', () => {
  let component: MyFormsPage;
  let fixture: ComponentFixture<MyFormsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFormsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyFormsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddIoiTypePage } from './add-ioi-type.page';

describe('AddIoiTypePage', () => {
  let component: AddIoiTypePage;
  let fixture: ComponentFixture<AddIoiTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddIoiTypePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddIoiTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

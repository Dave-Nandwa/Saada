import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddIoiStatusPage } from './add-ioi-status.page';

describe('AddIoiStatusPage', () => {
  let component: AddIoiStatusPage;
  let fixture: ComponentFixture<AddIoiStatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddIoiStatusPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddIoiStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

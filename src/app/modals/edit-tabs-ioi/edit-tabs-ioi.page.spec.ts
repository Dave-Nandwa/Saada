import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditTabsIoiPage } from './edit-tabs-ioi.page';

describe('EditTabsIoiPage', () => {
  let component: EditTabsIoiPage;
  let fixture: ComponentFixture<EditTabsIoiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTabsIoiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditTabsIoiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

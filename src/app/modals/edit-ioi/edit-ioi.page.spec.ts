import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditIoiPage } from './edit-ioi.page';

describe('EditIoiPage', () => {
  let component: EditIoiPage;
  let fixture: ComponentFixture<EditIoiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditIoiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditIoiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

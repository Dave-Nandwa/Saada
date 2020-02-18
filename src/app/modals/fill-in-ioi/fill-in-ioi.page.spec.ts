import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FillInIoiPage } from './fill-in-ioi.page';

describe('FillInIoiPage', () => {
  let component: FillInIoiPage;
  let fixture: ComponentFixture<FillInIoiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FillInIoiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FillInIoiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

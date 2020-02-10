import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SpotReportPage } from './spot-report.page';

describe('SpotReportPage', () => {
  let component: SpotReportPage;
  let fixture: ComponentFixture<SpotReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotReportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SpotReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

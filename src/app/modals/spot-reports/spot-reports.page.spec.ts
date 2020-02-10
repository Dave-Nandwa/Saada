import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SpotReportsPage } from './spot-reports.page';

describe('SpotReportsPage', () => {
  let component: SpotReportsPage;
  let fixture: ComponentFixture<SpotReportsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotReportsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SpotReportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

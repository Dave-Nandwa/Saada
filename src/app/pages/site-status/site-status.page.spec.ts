import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SiteStatusPage } from './site-status.page';

describe('SiteStatusPage', () => {
  let component: SiteStatusPage;
  let fixture: ComponentFixture<SiteStatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteStatusPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SiteStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

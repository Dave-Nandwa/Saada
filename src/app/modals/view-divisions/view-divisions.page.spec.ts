import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewDivisionsPage } from './view-divisions.page';

describe('ViewDivisionsPage', () => {
  let component: ViewDivisionsPage;
  let fixture: ComponentFixture<ViewDivisionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDivisionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewDivisionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateSponsorCodePage } from './create-sponsor-code.page';

describe('CreateSponsorCodePage', () => {
  let component: CreateSponsorCodePage;
  let fixture: ComponentFixture<CreateSponsorCodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSponsorCodePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSponsorCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

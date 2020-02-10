import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddMediaPage } from './add-media.page';

describe('AddMediaPage', () => {
  let component: AddMediaPage;
  let fixture: ComponentFixture<AddMediaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMediaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddMediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

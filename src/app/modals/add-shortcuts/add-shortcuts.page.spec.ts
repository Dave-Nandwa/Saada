import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddShortcutsPage } from './add-shortcuts.page';

describe('AddShortcutsPage', () => {
  let component: AddShortcutsPage;
  let fixture: ComponentFixture<AddShortcutsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddShortcutsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddShortcutsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

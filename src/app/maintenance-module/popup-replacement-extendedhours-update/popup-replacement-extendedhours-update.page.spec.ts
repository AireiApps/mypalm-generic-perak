import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopupReplacementExtendedhoursUpdatePage } from './popup-replacement-extendedhours-update.page';

describe('PopupReplacementExtendedhoursUpdatePage', () => {
  let component: PopupReplacementExtendedhoursUpdatePage;
  let fixture: ComponentFixture<PopupReplacementExtendedhoursUpdatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupReplacementExtendedhoursUpdatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopupReplacementExtendedhoursUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopupNotificationViewPage } from './popup-notification-view.page';

describe('PopupNotificationViewPage', () => {
  let component: PopupNotificationViewPage;
  let fixture: ComponentFixture<PopupNotificationViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupNotificationViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopupNotificationViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

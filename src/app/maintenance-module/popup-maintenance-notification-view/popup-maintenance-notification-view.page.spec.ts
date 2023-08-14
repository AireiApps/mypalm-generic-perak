import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopupMaintenanceNotificationViewPage } from './popup-maintenance-notification-view.page';

describe('PopupMaintenanceNotificationViewPage', () => {
  let component: PopupMaintenanceNotificationViewPage;
  let fixture: ComponentFixture<PopupMaintenanceNotificationViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupMaintenanceNotificationViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopupMaintenanceNotificationViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

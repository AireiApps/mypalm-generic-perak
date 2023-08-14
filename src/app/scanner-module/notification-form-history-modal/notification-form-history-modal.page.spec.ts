import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NotificationFormHistoryModalPage } from './notification-form-history-modal.page';

describe('NotificationFormHistoryModalPage', () => {
  let component: NotificationFormHistoryModalPage;
  let fixture: ComponentFixture<NotificationFormHistoryModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationFormHistoryModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationFormHistoryModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

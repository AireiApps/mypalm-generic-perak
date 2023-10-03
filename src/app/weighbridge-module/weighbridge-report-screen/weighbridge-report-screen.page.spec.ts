import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WeighbridgeReportScreenPage } from './weighbridge-report-screen.page';

describe('WeighbridgeReportScreenPage', () => {
  let component: WeighbridgeReportScreenPage;
  let fixture: ComponentFixture<WeighbridgeReportScreenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeighbridgeReportScreenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WeighbridgeReportScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

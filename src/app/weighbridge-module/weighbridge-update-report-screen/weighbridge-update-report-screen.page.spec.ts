import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WeighbridgeUpdateReportScreenPage } from './weighbridge-update-report-screen.page';

describe('WeighbridgeUpdateReportScreenPage', () => {
  let component: WeighbridgeUpdateReportScreenPage;
  let fixture: ComponentFixture<WeighbridgeUpdateReportScreenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeighbridgeUpdateReportScreenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WeighbridgeUpdateReportScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

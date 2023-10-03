import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AbnormalReportScreenPage } from './abnormal-report-screen.page';

describe('AbnormalReportScreenPage', () => {
  let component: AbnormalReportScreenPage;
  let fixture: ComponentFixture<AbnormalReportScreenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbnormalReportScreenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AbnormalReportScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabSterilizerstationReportPage } from './tab-sterilizerstation-report.page';

describe('TabSterilizerstationReportPage', () => {
  let component: TabSterilizerstationReportPage;
  let fixture: ComponentFixture<TabSterilizerstationReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabSterilizerstationReportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabSterilizerstationReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

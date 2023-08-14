import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabPressstationReportPage } from './tab-pressstation-report.page';

describe('TabPressstationReportPage', () => {
  let component: TabPressstationReportPage;
  let fixture: ComponentFixture<TabPressstationReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabPressstationReportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabPressstationReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabLaboillossReportPage } from './tab-laboilloss-report.page';

describe('TabLaboillossReportPage', () => {
  let component: TabLaboillossReportPage;
  let fixture: ComponentFixture<TabLaboillossReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabLaboillossReportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabLaboillossReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

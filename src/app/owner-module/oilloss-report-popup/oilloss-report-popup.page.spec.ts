import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OillossReportPopupPage } from './oilloss-report-popup.page';

describe('OillossReportPopupPage', () => {
  let component: OillossReportPopupPage;
  let fixture: ComponentFixture<OillossReportPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OillossReportPopupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OillossReportPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

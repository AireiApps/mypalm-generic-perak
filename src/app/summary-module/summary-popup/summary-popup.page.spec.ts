import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SummaryPopupPage } from './summary-popup.page';

describe('SummaryPopupPage', () => {
  let component: SummaryPopupPage;
  let fixture: ComponentFixture<SummaryPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryPopupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LabOillossesDashboardPage } from './lab-oillosses-dashboard.page';

describe('LabOillossesDashboardPage', () => {
  let component: LabOillossesDashboardPage;
  let fixture: ComponentFixture<LabOillossesDashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabOillossesDashboardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LabOillossesDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

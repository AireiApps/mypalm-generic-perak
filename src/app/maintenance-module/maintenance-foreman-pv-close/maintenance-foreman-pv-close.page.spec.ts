import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MaintenanceForemanPvClosePage } from './maintenance-foreman-pv-close.page';

describe('MaintenanceForemanPvClosePage', () => {
  let component: MaintenanceForemanPvClosePage;
  let fixture: ComponentFixture<MaintenanceForemanPvClosePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenanceForemanPvClosePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceForemanPvClosePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

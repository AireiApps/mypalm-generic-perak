import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabPreventivemaintenancePage } from './tab-preventivemaintenance.page';

describe('TabPreventivemaintenancePage', () => {
  let component: TabPreventivemaintenancePage;
  let fixture: ComponentFixture<TabPreventivemaintenancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabPreventivemaintenancePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabPreventivemaintenancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

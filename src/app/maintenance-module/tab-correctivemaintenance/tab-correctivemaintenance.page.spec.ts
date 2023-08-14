import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabCorrectivemaintenancePage } from './tab-correctivemaintenance.page';

describe('TabCorrectivemaintenancePage', () => {
  let component: TabCorrectivemaintenancePage;
  let fixture: ComponentFixture<TabCorrectivemaintenancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabCorrectivemaintenancePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabCorrectivemaintenancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

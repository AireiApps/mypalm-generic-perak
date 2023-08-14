import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabPreventivemaintenanceNewPage } from './tab-preventivemaintenance-new.page';

describe('TabPreventivemaintenanceNewPage', () => {
  let component: TabPreventivemaintenanceNewPage;
  let fixture: ComponentFixture<TabPreventivemaintenanceNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabPreventivemaintenanceNewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabPreventivemaintenanceNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabOillossesNewPage } from './tab-oillosses-new.page';

describe('TabOillossesNewPage', () => {
  let component: TabOillossesNewPage;
  let fixture: ComponentFixture<TabOillossesNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabOillossesNewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabOillossesNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

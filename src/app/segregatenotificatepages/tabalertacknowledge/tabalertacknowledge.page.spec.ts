import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabalertacknowledgePage } from './tabalertacknowledge.page';

describe('TabalertacknowledgePage', () => {
  let component: TabalertacknowledgePage;
  let fixture: ComponentFixture<TabalertacknowledgePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabalertacknowledgePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabalertacknowledgePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

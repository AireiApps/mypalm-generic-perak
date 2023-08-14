import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OillossReportsPage } from './oilloss-reports.page';

describe('OillossReportsPage', () => {
  let component: OillossReportsPage;
  let fixture: ComponentFixture<OillossReportsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OillossReportsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OillossReportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

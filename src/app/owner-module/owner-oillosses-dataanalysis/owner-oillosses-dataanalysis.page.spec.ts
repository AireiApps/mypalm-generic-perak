import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OwnerOillossesDataanalysisPage } from './owner-oillosses-dataanalysis.page';

describe('OwnerOillossesDataanalysisPage', () => {
  let component: OwnerOillossesDataanalysisPage;
  let fixture: ComponentFixture<OwnerOillossesDataanalysisPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerOillossesDataanalysisPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OwnerOillossesDataanalysisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OillossRecomandationModalPage } from './oilloss-recomandation-modal.page';

describe('OillossRecomandationModalPage', () => {
  let component: OillossRecomandationModalPage;
  let fixture: ComponentFixture<OillossRecomandationModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OillossRecomandationModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OillossRecomandationModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

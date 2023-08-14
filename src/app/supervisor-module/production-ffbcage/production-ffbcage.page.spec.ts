import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductionFfbcagePage } from './production-ffbcage.page';

describe('ProductionFfbcagePage', () => {
  let component: ProductionFfbcagePage;
  let fixture: ComponentFixture<ProductionFfbcagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionFfbcagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductionFfbcagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

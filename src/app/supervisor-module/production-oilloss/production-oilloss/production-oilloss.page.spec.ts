import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductionOillossPage } from './production-oilloss.page';

describe('ProductionOillossPage', () => {
  let component: ProductionOillossPage;
  let fixture: ComponentFixture<ProductionOillossPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionOillossPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductionOillossPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OwnerProductionPage } from './owner-production.page';

describe('OwnerProductionPage', () => {
  let component: OwnerProductionPage;
  let fixture: ComponentFixture<OwnerProductionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerProductionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OwnerProductionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

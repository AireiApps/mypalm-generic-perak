import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WeighbridgeUpdateScreenPage } from './weighbridge-update-screen.page';

describe('WeighbridgeUpdateScreenPage', () => {
  let component: WeighbridgeUpdateScreenPage;
  let fixture: ComponentFixture<WeighbridgeUpdateScreenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeighbridgeUpdateScreenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WeighbridgeUpdateScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

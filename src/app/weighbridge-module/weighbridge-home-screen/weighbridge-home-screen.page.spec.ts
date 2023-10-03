import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WeighbridgeHomeScreenPage } from './weighbridge-home-screen.page';

describe('WeighbridgeHomeScreenPage', () => {
  let component: WeighbridgeHomeScreenPage;
  let fixture: ComponentFixture<WeighbridgeHomeScreenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeighbridgeHomeScreenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WeighbridgeHomeScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

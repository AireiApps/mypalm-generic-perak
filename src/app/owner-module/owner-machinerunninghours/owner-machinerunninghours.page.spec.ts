import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OwnerMachinerunninghoursPage } from './owner-machinerunninghours.page';

describe('OwnerMachinerunninghoursPage', () => {
  let component: OwnerMachinerunninghoursPage;
  let fixture: ComponentFixture<OwnerMachinerunninghoursPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerMachinerunninghoursPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OwnerMachinerunninghoursPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

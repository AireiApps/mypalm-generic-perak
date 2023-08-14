import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateExtendedrunninghoursPage } from './update-extendedrunninghours.page';

describe('UpdateExtendedrunninghoursPage', () => {
  let component: UpdateExtendedrunninghoursPage;
  let fixture: ComponentFixture<UpdateExtendedrunninghoursPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateExtendedrunninghoursPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateExtendedrunninghoursPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DooropenlaterUpdateModalPage } from './dooropenlater-update-modal.page';

describe('DooropenlaterUpdateModalPage', () => {
  let component: DooropenlaterUpdateModalPage;
  let fixture: ComponentFixture<DooropenlaterUpdateModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DooropenlaterUpdateModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DooropenlaterUpdateModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

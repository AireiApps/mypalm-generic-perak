import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OillossesNewPage } from './oillosses-new.page';

describe('OillossesNewPage', () => {
  let component: OillossesNewPage;
  let fixture: ComponentFixture<OillossesNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OillossesNewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OillossesNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

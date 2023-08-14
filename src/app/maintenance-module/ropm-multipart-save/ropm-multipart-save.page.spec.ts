import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RopmMultipartSavePage } from './ropm-multipart-save.page';

describe('RopmMultipartSavePage', () => {
  let component: RopmMultipartSavePage;
  let fixture: ComponentFixture<RopmMultipartSavePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RopmMultipartSavePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RopmMultipartSavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RepmMultipartSavePage } from './repm-multipart-save.page';

describe('RepmMultipartSavePage', () => {
  let component: RepmMultipartSavePage;
  let fixture: ComponentFixture<RepmMultipartSavePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepmMultipartSavePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RepmMultipartSavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CmMultipartSavePage } from './cm-multipart-save.page';

describe('CmMultipartSavePage', () => {
  let component: CmMultipartSavePage;
  let fixture: ComponentFixture<CmMultipartSavePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmMultipartSavePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CmMultipartSavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

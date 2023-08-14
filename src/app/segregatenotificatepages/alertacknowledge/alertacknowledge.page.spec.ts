import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlertacknowledgePage } from './alertacknowledge.page';

describe('AlertacknowledgePage', () => {
  let component: AlertacknowledgePage;
  let fixture: ComponentFixture<AlertacknowledgePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertacknowledgePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertacknowledgePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

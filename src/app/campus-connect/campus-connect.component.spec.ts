import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusConnectComponent } from './campus-connect.component';

describe('CampusConnectComponent', () => {
  let component: CampusConnectComponent;
  let fixture: ComponentFixture<CampusConnectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampusConnectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampusConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserNgrx } from './user-ngrx';

describe('UserNgrx', () => {
  let component: UserNgrx;
  let fixture: ComponentFixture<UserNgrx>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserNgrx],
    }).compileComponents();

    fixture = TestBed.createComponent(UserNgrx);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ApplicationDetailsComponent } from './application-details.component';

describe('ApplicationDetailsComponent', () => {
  let component: ApplicationDetailsComponent;
  let fixture: ComponentFixture<ApplicationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationDetailsComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

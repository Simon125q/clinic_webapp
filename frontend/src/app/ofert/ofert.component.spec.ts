import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertComponent } from './ofert.component';

describe('OfertComponent', () => {
  let component: OfertComponent;
  let fixture: ComponentFixture<OfertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OfertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

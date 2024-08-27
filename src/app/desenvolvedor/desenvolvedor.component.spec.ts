import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesenvolvedorComponent } from './desenvolvedor.component';

describe('DesenvolvedorComponent', () => {
  let component: DesenvolvedorComponent;
  let fixture: ComponentFixture<DesenvolvedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesenvolvedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesenvolvedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

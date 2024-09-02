import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoCompraComponent } from './historico-compra.component';

describe('HistoricoCompraComponent', () => {
  let component: HistoricoCompraComponent;
  let fixture: ComponentFixture<HistoricoCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoCompraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importa o HttpClient
import { CommonModule } from '@angular/common';

interface itemVenda {
  "id_item_venda": number,
  "id_venda": number,
  "id_aplicativo": number,
  "preco": number,
  "quantidade": number,
  "nome": string,
  "descricao": string,
  "id_desenvolvedor": number,
  "id_usuario": number
  "data_venda": string,
  "total": number
}

@Component({
  selector: 'user-historico-compra',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historico-compra.component.html',
  styleUrl: './historico-compra.component.css'
})
export class HistoricoCompraComponent implements OnInit {
  constructor(private http: HttpClient) {} // Injeta o HttpClient
  @Input() usuarioId: number = 0;
  historico: itemVenda[] = [];


  ngOnInit(): void {
    this.http.get<itemVenda[]>('http://localhost:3000/compras/'+this.usuarioId).subscribe({
      next: (response) => {
        this.historico = response;
      },
      error: (error) => {
        console.error('Erro na requisição:', error);
      }
    });
  }
}

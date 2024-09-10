import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

interface totalCompras {
  "total_apps_comprados": number
}

@Component({
  selector: 'user-historico-compra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historico-compra.component.html',
  styleUrl: './historico-compra.component.css'
})
export class HistoricoCompraComponent implements OnInit {
  constructor(private http: HttpClient) {} // Injeta o HttpClient
  @Input() usuarioId: number = 0;
  historico: itemVenda[] = [];
  total: number = 0;
  valor: number = 0;

  deleteItem(id: number) {
    this.http.delete('http://localhost:3000/deleteItemVenda/'+id).subscribe({
      next: (response) => {
        console.log('Item deletado com sucesso:', response);
        this.getHistorico();
        this.getTotal();
      },
      error: (error) => {
        console.error('Erro na requisição:', error);
      }
    });
  }
  onValorChange() {
    this.getTotal();
    console.log('Valor: ',this.valor);
  }
  getTotal(){
    this.http.get<totalCompras[]>('http://localhost:3000/totalCompras/'+this.usuarioId+'/'+this.valor).subscribe({
      next: (response) => {
        console.log(response);
        if (response.length == 0) {
          this.total = 0;
          return;
        }
        console.log('Total de compras: ',response[0].total_apps_comprados);
        this.total = response[0].total_apps_comprados;
      },
      error: (error) => {
        console.error('Erro na requisição:', error);
      }
    });
  }
  getHistorico() {
    this.http.get<itemVenda[]>('http://localhost:3000/compras/'+this.usuarioId).subscribe({
      next: (response) => {
        this.historico = response;
      },
      error: (error) => {
        console.error('Erro na requisição:', error);
      }
    });
  }
  ngOnInit(): void {
    this.getTotal();
    this.getHistorico();
  }
}

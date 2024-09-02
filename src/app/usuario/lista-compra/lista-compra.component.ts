import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importa o HttpClient
import { CommonModule } from '@angular/common';

interface Aplicativo {
  id_aplicativo: number;
  nome: string;
  descricao: string;
  preco: number;
  id_desenvolvedor: number;
}

interface ItemCarrinho {
  app: Aplicativo;
  quantidade: number;
}

interface responseCompra {
  mensagem: string;
}

@Component({
  selector: 'lista-compra',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-compra.component.html',
  styleUrl: './lista-compra.component.css'
})
export class ListaCompraComponent implements OnInit {
  constructor(private http: HttpClient) {} // Injeta o HttpClient

  @Input() usuarioId: number = 0;

  lista_apps: Aplicativo[] = [];
  listaCompras: ItemCarrinho[] = []; 

  resposta_Compra: string = '';

  finalizarCompra() {
    const compraData = {
      usuarioId: this.usuarioId,
      listaCompras: this.listaCompras
    };
    console.log('Iniciando compra: ', compraData);
    this.http.post<responseCompra>('http://localhost:3000/comprarCarrinho', compraData).subscribe({
      next: (response) => {
        console.log('Resposta da API:', response);
        this.resposta_Compra = response.mensagem;
        this.listaCompras = [];
       },
      error: (error) => {
        console.error('Erro na requisição:', error);
      }
    });
  }

  adicionarAoCarrinho(app: Aplicativo, quantidade: number){
    if (quantidade > 0) { // Verifica se a quantidade é válida
      const itemExistente = this.listaCompras.find(item => item.app.id_aplicativo === app.id_aplicativo);
      
      if (itemExistente) {
        itemExistente.quantidade += quantidade; // Atualiza a quantidade se o item já estiver no carrinho
      } else {
        this.listaCompras.push({ app, quantidade }); // Adiciona novo item ao carrinho
      }
      console.log('Aplicativo adicionado ao carrinho:', app, 'Quantidade:', quantidade);
    } else {
      console.error('Quantidade inválida.');
    }
  }

  ngOnInit(): void {
    this.http.get<Aplicativo[]>('http://localhost:3000/select/aplicativo').subscribe({
      next: (response) => {
        this.lista_apps = response;
      },
      error: (error) => {
        console.error('Erro na requisição:', error);
      }
    });
  }
}

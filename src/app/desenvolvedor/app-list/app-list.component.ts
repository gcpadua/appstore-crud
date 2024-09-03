import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClient } from '@angular/common/http'; // Importa o HttpClient
import { CommonModule } from '@angular/common';

interface aplicativo {
  id_aplicativo: number;
  nome: string;
  descricao: string;
  preco: number;
  id_desenvolvedor: number;
}

interface addAppResponse {
  id: number;
}

@Component({
  selector: 'dev-app-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app-list.component.html',
  styleUrl: './app-list.component.css'
})
export class AppListComponent implements OnInit {
  constructor(private http: HttpClient) {} // Injeta o HttpClient
  @Input() devId: number = 0;
  applist: aplicativo[] = [];
  novo_nome: string = '';
  novo_desc: string = '';
  novo_preco: number = 0;

  adicionarApp(){
    console.log('Adicionando aplicativo:', this.novo_nome, this.novo_desc, this.novo_preco);
    const body = { 
      nome: this.novo_nome, 
      descricao: this.novo_desc, 
      preco: this.novo_preco, 
      id_desenvolvedor: this.devId 
    };
    this.http.post<addAppResponse>('http://localhost:3000/addaplication', body).subscribe({
      next: (response) => {
        console.log('Resposta:', response);
        this.fetchApps();
      },
      error: (error) => {
        console.error('Erro na requisição:', error);
      }
    });
  }

  alterarPreco(id: number, preco: number) {
    const body = { novo_preco: preco };
    this.http.put('http://localhost:3000/updateprice/'+id+'/'+this.devId, body).subscribe({
      next: (response) => {
        console.log('Resposta:', response);
        this.fetchApps();
      },
      error: (error) => {
        console.error('Erro na requisição:', error);
      }
    });
  }

  fetchApps() {
    this.http.get<aplicativo[]>('http://localhost:3000/where/aplicativo/id_desenvolvedor='+this.devId).subscribe({
      next: (response) => {
        console.log('Resposta:', response);
        this.applist = response;
      },
      error: (error) => {
        console.error('Erro na requisição:', error);
      }
    });
  }
  ngOnInit(): void {
    this.fetchApps();
  }
}

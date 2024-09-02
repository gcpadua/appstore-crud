import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importa o HttpClient
import { CommonModule } from '@angular/common';

interface usuario {
  id_usuario: number;
  primeiro_nome: string;
  ultimo_nome: string;
  email: string;
  senha: string;
  saldo: number;
}

@Component({
  selector: 'user-info-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-banner.component.html',
  styleUrl: './info-banner.component.css'
})
export class InfoBannerComponent implements OnInit {
  constructor(private http: HttpClient) {} // Injeta o HttpClient
  @Input() usuarioId: number = 0;

  primeiro_nome: string = 'primeiro';
  ultimo_nome: string = 'ultimo';
  email: string = 'mail';
  saldo: number = 0;

  addSaldo(valor: string) {
    const requisicao = {
      valorAdicionado: Number(valor)
    };

    this.http.put('http://localhost:3000/addbalanceuser/'+this.usuarioId, requisicao).subscribe({
      next: (response) => {
        console.log('Resposta:', response);
        this.fetchUserInfo();
      },
      error: (error) => {
        console.error('Erro na requisição:', error);
      }
    });
  }


  fetchUserInfo() {
    this.http.get<usuario[]>('http://localhost:3000/where/usuario/id_usuario='+this.usuarioId).subscribe({
      next: (response) => {
        console.log('Resposta:', response);
        this.primeiro_nome = response[0].primeiro_nome;
        this.ultimo_nome = response[0].ultimo_nome;
        this.email = response[0].email;
        this.saldo = response[0].saldo;
      },
      error: (error) => {
        console.error('Erro na requisição:', error);
      }
    });
  }

  ngOnInit(): void {
    console.log('Obtendo informações do usuário com ID:', this.usuarioId);
    this.fetchUserInfo();
  }
}

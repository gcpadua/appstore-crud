import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; // Importa o HttpClient

interface UserResponse {
  mensagem: string;
}

@Component({
  selector: 'dev-editar-info',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-info.component.html',
  styleUrl: './editar-info.component.css'
})
export class EditarInfoComponent {
  constructor(private http: HttpClient) {} // Injeta o HttpClient
  @Input() desenvolvedorId: number = 0;
  primeiroNome: string = '';
  ultimoNome: string = '';
  email: string = '';
  senha: string = '';

  apiResponse: string = '';

  onDelete(){
    this.http.delete<UserResponse>('http://localhost:3000/deleteDev/' + this.desenvolvedorId).subscribe({
      next: (response) => {
        console.log('Resposta da API:', response);
        this.apiResponse = response.mensagem;
      },
      error: (error) => {
        console.error('Erro na requisição:', error);
      }
    });
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
  onSubmit() {
    const editedProfile = {
      id_desenvolvedor: this.desenvolvedorId,
      primeiroNome: this.primeiroNome,
      ultimoNome: this.ultimoNome,
      email: this.email,
      senha: this.senha
    };

    this.http.put<UserResponse>('http://localhost:3000/editDev', editedProfile).subscribe({
      next: (response) => {
        console.log('Resposta da API:', response);
      },
      error: (error) => {
        console.error('Erro na requisição:', error);
      }
    });
  }
}

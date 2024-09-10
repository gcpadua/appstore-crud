import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClient } from '@angular/common/http'; // Importa o HttpClient

interface UserResponse {
  mensagem: string;
}

@Component({
  selector: 'user-editar-info',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './editar-info.component.html',
  styleUrl: './editar-info.component.css'
})
export class EditarInfoComponent {
  constructor(private http: HttpClient) {} // Injeta o HttpClient
  @Input() usuarioId: number = 0;
  primeiroNome: string = '';
  ultimoNome: string = '';
  email: string = '';
  senha: string = '';

  apiResponse: string = '';

  onDelete(){
    this.http.delete<UserResponse>('http://localhost:3000/deleteUser/' + this.usuarioId).subscribe({
      next: (response) => {
        console.log('Resposta da API:', response);
        this.apiResponse = response.mensagem;
      },
      error: (error) => {
        console.error('Erro na requisição:', error);
      }
    });
  }
  onSubmit() {
    const editedProfile = {
      id_usuario: this.usuarioId,
      primeiroNome: this.primeiroNome,
      ultimoNome: this.ultimoNome,
      email: this.email,
      senha: this.senha
    };

    this.http.put<UserResponse>('http://localhost:3000/editUser', editedProfile).subscribe({
      next: (response) => {
        console.log('Resposta da API:', response);
      },
      error: (error) => {
        console.error('Erro na requisição:', error);
      }
    });
  }
}

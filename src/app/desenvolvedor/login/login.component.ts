import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClient } from '@angular/common/http'; // Importa o HttpClient

interface UserResponse {
  id_desenvolvedor: number;
}

@Component({
  selector: 'dev-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private http: HttpClient) {} // Injeta o HttpClient

  email: string = '';
  senha: string = '';

  @Output() userLoginEvent = new EventEmitter<number>();
  onSubmit() {
    // console.log('Email: ' + this.email);
    // console.log('Senha: ' + this.senha);
    const loginData = {
      email: this.email,
      senha: this.senha
    };
    // Faz a requisição POST para a API
    this.http.post<UserResponse>('http://localhost:3000/devlogin', loginData).subscribe({
      next: (response) => {
        console.log('Resposta da API:', response);
        const userID = response.id_desenvolvedor;
        // console.log('ID do usuário:', userID);
        // console.log(typeof userID);
        this.userLoginEvent.emit(userID); // Emite o evento com o número para o componente pai
      },
      error: (error) => {
        console.error('Erro na requisição:', error);
      }
    });
  }
}

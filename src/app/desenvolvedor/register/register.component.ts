import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClient } from '@angular/common/http'; // Importa o HttpClient

interface UserResponse {
  id_desenvolvedor: number;
}

@Component({
  selector: 'dev-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private http: HttpClient) {} // Injeta o HttpClient

  email: string = '';
  senha: string = '';
  fistName: string = '';
  lastName: string = '';

  @Output() userRegisterEvent = new EventEmitter<number>();
  onSubmit() {
    const registerData = {
      email: this.email,
      senha: this.senha,
      primeiroNome: this.fistName,
      ultimoNome: this.lastName
    };
    console.log('Dados do registro:', registerData);
    this.http.post<UserResponse>('http://localhost:3000/devregister', registerData).subscribe({
      next: (response) => {
        console.log('Resposta da API:', response);
        const userID = response.id_desenvolvedor;
        // console.log('ID do usuário:', userID);
        // console.log(typeof userID);
        this.userRegisterEvent.emit(userID); // Emite o evento com o número para o componente pai
      },
      error: (error) => {
        console.error('Erro na requisição:', error);
      }
    });
  }
}

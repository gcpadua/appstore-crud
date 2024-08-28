import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from "./login/login.component";

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, LoginComponent],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {
  usuaioLogado: number = 0;
  handleLogin(numberReceived: number) {
    this.usuaioLogado = numberReceived;
  }
}

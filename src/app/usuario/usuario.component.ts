import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from "./login/login.component";
import { ListaCompraComponent } from "./lista-compra/lista-compra.component";
import { InfoBannerComponent } from "./info-banner/info-banner.component";
import { RegisterComponent } from "./register/register.component";
import { HistoricoCompraComponent } from "./historico-compra/historico-compra.component";
import { EditarInfoComponent } from "./editar-info/editar-info.component";

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, LoginComponent, ListaCompraComponent, InfoBannerComponent, RegisterComponent, HistoricoCompraComponent, EditarInfoComponent],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {
  usuarioLogado: number = 1;
  login_register: number = 0;
  comprar_historico: number = 0;

  handleLogin(numberReceived: number) {
    this.usuarioLogado = numberReceived;
  }

  handleRegister(numberReceived: number) {
    this.usuarioLogado = numberReceived;
  }
}

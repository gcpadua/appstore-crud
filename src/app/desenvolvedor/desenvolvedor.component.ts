import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from './register/register.component';
import { AppListComponent } from './app-list/app-list.component';
import { InfoBannerComponent } from './info-banner/info-banner.component';
import { EditarInfoComponent } from './editar-info/editar-info.component';

@Component({
  selector: 'app-desenvolvedor',
  standalone: true,
  imports: [CommonModule, LoginComponent, RegisterComponent, AppListComponent, InfoBannerComponent, EditarInfoComponent],
  templateUrl: './desenvolvedor.component.html',
  styleUrl: './desenvolvedor.component.css'
})
export class DesenvolvedorComponent {
  devLogado: number = 0;
  login_register: number = 0;

  handleLogin(numberReceived: number) {
    this.devLogado = numberReceived;
  }

  handleRegister(numberReceived: number) {
    this.devLogado = numberReceived;
  }
}

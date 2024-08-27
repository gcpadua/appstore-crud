import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioComponent } from "./usuario/usuario.component";
import { DesenvolvedorComponent } from "./desenvolvedor/desenvolvedor.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, UsuarioComponent, DesenvolvedorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'appstore-crud';
  selectedPage: string = '';

  selecionarPagina(pagina: string) {
    this.selectedPage = pagina;
  }
}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DictionaryComponent } from './components/dictionary.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DictionaryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dictionary';

  
}

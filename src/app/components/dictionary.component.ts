import { Component } from "@angular/core";
import { DictionaryServiceProvider } from "./service/dictionary.provider";

@Component({
    selector: 'dictionary',
    imports: [],
    providers: [DictionaryServiceProvider],
    templateUrl: './dictionary.template.html',
    styleUrl: './dictionary.style.scss'
})
export class DictionaryComponent {
    title = 'dictionary';

}

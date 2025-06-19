import { Component } from "@angular/core";
import { DictionaryServiceProvider } from "./service/dictionary.provider";
import { LangInput } from "./langInput/langInput.component";

@Component({
    selector: 'dictionary',
    imports: [LangInput],
    providers: [DictionaryServiceProvider],
    templateUrl: './dictionary.template.html',
    styleUrl: './dictionary.style.scss'
})
export class DictionaryComponent {
    title = 'dictionary';

}

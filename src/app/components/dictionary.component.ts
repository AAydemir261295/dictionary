import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DictionaryServiceProvider } from "./service/dictionary.provider";
import { LangInput } from "./langInput/langInput.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Language } from "./service/models/Language";
import { DictionaryService } from "./service/dictionary.service";

@Component({
    selector: 'dictionary',
    imports: [ReactiveFormsModule, LangInput],
    providers: [DictionaryServiceProvider],
    templateUrl: './dictionary.template.html',
    styleUrl: './dictionary.style.scss',
    standalone: true,
})
export class DictionaryComponent implements OnInit {
    title = 'dictionary';

    constructor(private service: DictionaryService) {
        this.items = this.service.getLanguages();
    }

    items: Language[] = []


    form: FormGroup = new FormGroup({
        text: new FormControl(""),
        langInput: new FormControl(""),
        langOutput: new FormControl("")
    })

    formAction() {
    }

  

    ngOnInit(): void {
    }

}

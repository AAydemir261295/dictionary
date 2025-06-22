import { Component } from "@angular/core";
import { DictionaryService } from "../../services/dictionary.service";
import { Result } from "../../services/models/Result";
import { WordCardComponent } from "./wordCard/wordCard.component";


@Component({
    selector: 'translate-result',
    imports: [WordCardComponent],
    providers: [],
    templateUrl: './translateResult.template.html',
    styleUrl: './translateResult.style.scss',
    standalone: true,
})
export class TranslateResultComponent {
    constructor(private service: DictionaryService) {
        this.service.getTranslateResult().subscribe(r => {
            this.translateResult = r
            console.log(r);
        })
    }

 

    translateResult: Result | undefined;
}
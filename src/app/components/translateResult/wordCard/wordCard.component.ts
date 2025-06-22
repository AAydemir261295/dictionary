import { Component, Input } from "@angular/core";
import { TranslateRow } from "../../../services/models/Result";

@Component({
    selector: 'word-card',
    imports: [],
    providers: [],
    templateUrl: './wordCard.template.html',
    styleUrl: './wordCard.style.scss',
    standalone: true,
})
export class WordCardComponent {

    wordTypes: { [key: string]: string } = {
        "noun": "существительное",
        "verb": "прилагательное",
        "adjective": "глагол",
    }

    @Input()
    data: TranslateRow | undefined;
}
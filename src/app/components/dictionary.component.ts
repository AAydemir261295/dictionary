import { Component, ElementRef, ViewChild } from "@angular/core";
import { DictionaryServiceProvider } from "../services/dictionary.provider";
import { LangInput } from "./langInput/langInput.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Language } from "../services/models/Language";
import { DictionaryService } from "../services/dictionary.service";
import { TranslateResultComponent } from "./translateResult/translateResult.component";
import { languageValidator } from "../libs/languageValidator";
import { MyLocalStorageProvider } from "../services/localStorage.provider";
import { API_KEY, API_KEY_VALUE } from "../services/apiKey.provider";

interface InputErrors {
    [errorType: string]: string
}

const inputErrors: InputErrors = {
    required: "Введите текст",
    isValid: "Выберите язык",
}

@Component({
    selector: 'dictionary',
    imports: [ReactiveFormsModule, LangInput, TranslateResultComponent],
    providers: [
        DictionaryServiceProvider,
        MyLocalStorageProvider,
        { provide: API_KEY, useValue: API_KEY_VALUE }
    ],
    templateUrl: './dictionary.template.html',
    styleUrl: './dictionary.style.scss',
    standalone: true,
})
export class DictionaryComponent {
    title = 'dictionary';

    constructor(private service: DictionaryService) {
        this.items = this.service.getLanguages();
        this.form.controls['langInput'].addValidators(languageValidator(this.service));
        this.form.controls['langOutput'].addValidators(languageValidator(this.service));
        this.form.valueChanges.subscribe((v) => {
            if (v) {
                this.hideErrors();
            }
        })
    }

    @ViewChild("errorContainer")
    errorContainer: ElementRef<HTMLDivElement> | undefined;
    errorText: string | undefined;
    isError: boolean | undefined;



    items: Language[] = []


    form: FormGroup = new FormGroup({
        text: new FormControl("", [Validators.required]),
        langInput: new FormControl(""),
        langOutput: new FormControl(""),
    })


    onCloseAnimationEnd() {
        if (this.isError == false) {
            this.errorText = undefined;
        }
    }

    hideErrors() {
        this.isError = false;
    }

    showErrors() {
        Object.entries(this.form.controls).forEach((c) => {
            const formControlName: string = c[0];
            const errors = this.form.controls[formControlName].errors;
            if (errors) {
                let errorNames: string[] = Object.keys(errors as {})
                this.errorText = inputErrors[errorNames[0]];
                this.isError = true;
            }
        })
    }

 

    onSubmit() {
        this.showErrors();
        if (!this.isError) {
            this.service.translate(this.form.value);
        }
    }
}

import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Subject, throwError } from "rxjs";
import { Language } from "./models/Language";
import { Result } from "./models/Result";
import { MyLocalStorage } from "./localStorage.service";
import { API_KEY } from "./apiKey.provider";


const getLangs = (key: string) => `https://dictionary.yandex.net/api/v1/dicservice.json/getLangs?key=${key}`
const lookUp = (key: string, text: string, from: string, to: string) => `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${key}&lang=${from}-${to}&text=${text}`
const ignoreLangCodes = ["mjr", "emj"]


Injectable({ providedIn: "root" })
export class DictionaryService {
    constructor(private http: HttpClient, private myStorage: MyLocalStorage) {
        this.apiKey = inject(API_KEY);
        let languages = localStorage.getItem("langs");
        if (!languages) {
            this.http.get(getLangs(this.apiKey)).pipe(catchError(this.handleError)).subscribe((response: any) => {
                this.prepareLanguages(response);
            })
        } else {
            this.languages = JSON.parse(localStorage.getItem("langs") as any);
        }
    }

    apiKey: string | undefined;

    languages: Language[] = [];

    translateResult: Subject<Result | undefined> = new Subject();

    getTranslateResult(): Subject<Result | undefined> {
        return this.translateResult;
    }

    getLanguages() {
        return this.languages;
    }

    getLanguageCode(language: string): any {
        return this.languages.find((v) => v.fullName == language)?.code;
    }

    translate(values: { text: string, langInput: string, langOutput: string }) {
        let isCached = this.myStorage.getItem(values.text, values.langInput, values.langOutput);
        if (isCached) {
            this.translateResult.next(isCached);
        } else {
            let from = this.getLanguageCode(values.langInput);
            let to = this.getLanguageCode(values.langOutput);
            this.http.get<Result>(lookUp(this.apiKey!, values.text, from, to))
                .pipe(catchError(this.handleError)).subscribe((r) => {
                    this.myStorage.setItem(r, values.text, values.langInput, values.langOutput);
                    this.translateResult.next(r);
                });
        }
    }

    parseToFullName(code: string) {
        const lang = new Intl.DisplayNames(['ru'], { type: 'language' });
        return lang.of(code);
    }


    prepareLanguages(langs: string[]) {
        for (let q = 0; q < langs.length; q++) {
            const languages = langs[q];
            var tmp: Language = { code: "", fullName: "" };
            var tmp1: Language = { code: "", fullName: "" };
            var splitted = languages.split("-");
            var from = splitted[0];
            var to = splitted[1];
            if (this.languages.find((v) => v.code == from) == undefined) {
                if (ignoreLangCodes.indexOf(from) == -1) {
                    tmp.code = from;
                    tmp.fullName = this.parseToFullName(from) as string;
                    this.languages.push(tmp);
                    continue;
                }
            } else if (this.languages.find((v) => v.code == to) == undefined) {
                if (ignoreLangCodes.indexOf(to) == -1) {
                    tmp1.code = to;
                    tmp1.fullName = this.parseToFullName(to) as string;
                    this.languages.push(tmp1)
                    continue;
                }
            }

        }
        localStorage.setItem("langs", JSON.stringify(this.languages));
    }



    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            console.error('An error occurred:', error.error);
        } else {
            console.error(
                `Backend returned code ${error.status}, body was: `, error.error);
        }
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }
}
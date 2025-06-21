import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { Language } from "./models/Language";


const getLangs = (key: string) => `https://dictionary.yandex.net/api/v1/dicservice.json/getLangs?key=${key}`
const lookUp = (key: string, text: string, from: string, to: string) => `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${key}&lang=${from}-${to}&text=${text}`
const ignoreLangCodes = ["mjr", "emj"]


Injectable({ providedIn: "root" })
export class DictionaryService {
    constructor(private http: HttpClient, private apiKey: string) {
        let languages = localStorage.getItem("langs");
        if (!languages) {
            this.http.get(getLangs(this.apiKey)).pipe(catchError(this.handleError)).subscribe((response: any) => {
                this.prepareLanguages(response);
            })
        } else {
            this.languages = JSON.parse(localStorage.getItem("langs") as any);
        }
    }

    languages: Language[] = [];

    translateResult: Observable<Response> | undefined;

    getLanguages() {
        return this.languages;
    }

    getLanguageCode(language: string) {
        return this.languages.find((v) => v.fullName == language)?.code;
    }

    translate(text: string, from: string, to: string) {
        this.translateResult = this.http.get<Response>(lookUp(this.apiKey, text, from, to)).pipe(catchError(this.handleError));
        this.translateResult.subscribe((r) => {
            console.log(r);
        });
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
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(
                `Backend returned code ${error.status}, body was: `, error.error);
        }
        // Return an observable with a user-facing error message.
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }
}
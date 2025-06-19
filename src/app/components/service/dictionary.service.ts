import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { Language } from "./models/Language";

const key = "dict.1.1.20250619T033726Z.6840cca2c782c33b.93de26b47845a21b1a52064c909fef1f22bc97ab";
const getLangs = (key: string) => `https://dictionary.yandex.net/api/v1/dicservice.json/getLangs?key=${key}`
const lookUp = (key: string, text: string, from: string, to: string) => `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${key}&lang=${from}-${to}&text=${text}`
const ignoreLangCodes = ["mjr", "emj"]


Injectable({ providedIn: "root" })
export class DictionaryService {
    constructor(private http: HttpClient) {
        let languages = localStorage.getItem("langs");
        if (!languages) {
            this.http.get(getLangs(key)).pipe(catchError(this.handleError)).subscribe((response: any) => {
                this.prepareLanguages(response);
            })
        } else {
            this.languages = JSON.parse(localStorage.getItem("langs") as any);
        }
    }

    languages: Language[] = [];

    getLanguages() {
        return this.languages;
    }


    translate(text: string, from: string, to: string) {
        return this.http.get(lookUp(key, text, from, to)).pipe(catchError(this.handleError))
    }


    parseToFullName(code: string) {
        const lang = new Intl.DisplayNames(['ru'], { type: 'language' });
        return lang.of(code);
    }


    prepareLanguages(langs: string[]) {
        for (let q = 0; q < langs.length; q++) {
            const languages = langs[q];
            var tmp: Language = {};
            var tmp1: Language = {};
            var splitted = languages.split("-");
            var from = splitted[0];
            var to = splitted[1];
            if (this.languages.find((v) => v[from]) == undefined) {
                if (ignoreLangCodes.indexOf(from) == -1) {
                    tmp[from] = this.parseToFullName(from) as string;
                    this.languages.push(tmp);
                }

            }
            if (this.languages.find((v) => v[to]) == undefined) {
                if (ignoreLangCodes.indexOf(to) == -1) {
                    tmp1[to] = this.parseToFullName(to) as string;
                    this.languages.push(tmp1)
                }
            }
        }
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
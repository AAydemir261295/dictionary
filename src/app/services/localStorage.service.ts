import { Injectable } from "@angular/core";
import { Result } from "./models/Result";

interface ExpirableItem {
    key: string,
    expiry: number,
}

Injectable({ providedIn: 'root' })
export class MyLocalStorage {

    constructor() {
        setInterval(() => {
            this.items.forEach((item) => {
                if (item.expiry < Date.now()) {
                    localStorage.removeItem(item.key);
                }
            })
        }, 10 * 60 * 1000);
    }

    items: ExpirableItem[] = [];

    setItem(item: Result, translateText: string, from: string, to: string) {
        let key = `{${translateText}_${from}_${to}}`;
        let expiry = Date.now() + (10 * 60 * 1000)
        this.items.push({ key: key, expiry: expiry });
        localStorage.setItem(key, JSON.stringify(item));
    }


    getItem(translateText: string, from: string, to: string) {
        let key = `{${translateText}_${from}_${to}}`;
        return JSON.parse(localStorage.getItem(key) as string);
    }

}
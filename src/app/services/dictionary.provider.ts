import { HttpClient } from "@angular/common/http";
import { DictionaryService } from "./dictionary.service";
import { MyLocalStorage } from "./localStorage.service";


const ServiceFactory =
    (http: HttpClient, myStorage: MyLocalStorage) => new DictionaryService(http, myStorage);


export const DictionaryServiceProvider = {
    provide: DictionaryService,
    useFactory: ServiceFactory,
    deps: [HttpClient, MyLocalStorage]
}

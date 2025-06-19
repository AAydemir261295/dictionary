import { HttpClient } from "@angular/common/http";
import { DictionaryService } from "./dictionary.service";

const ServiceFactory = (http: HttpClient) => new DictionaryService(http);


export const DictionaryServiceProvider = {
    provide: DictionaryService,
    useFactory: ServiceFactory,
    deps: [HttpClient]
}

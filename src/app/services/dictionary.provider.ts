import { HttpClient } from "@angular/common/http";
import { DictionaryService } from "./dictionary.service";


const apiKey = "dict.1.1.20250619T033726Z.6840cca2c782c33b.93de26b47845a21b1a52064c909fef1f22bc97ab";
const ServiceFactory = (http: HttpClient, apiKey: string) => new DictionaryService(http, apiKey);


export const DictionaryServiceProvider = {
    provide: DictionaryService,
    useFactory: (dep: HttpClient) => ServiceFactory(dep, apiKey),
    deps: [HttpClient]
}

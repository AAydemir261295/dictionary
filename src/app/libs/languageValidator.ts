import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { DictionaryService } from "../services/dictionary.service";


export function languageValidator(service: DictionaryService): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        var languageCode = service.getLanguageCode(control.value);
        return languageCode ? null : { isValid: false };
    }
}

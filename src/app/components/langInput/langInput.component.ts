import { Component, Input } from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { Subscription } from "rxjs";
import { Language } from "../service/models/Language";
import { DictionaryService } from "../service/dictionary.service";



@Component({
    selector: 'lang-input',
    imports: [ReactiveFormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: LangInput
        }
    ],
    templateUrl: './langInput.template.html',
    styleUrl: './langInput.style.scss'
})
export class LangInput implements ControlValueAccessor {
    title = 'dictionary';

    constructor(private service: DictionaryService) {
        this.items = this.service.getLanguages();
        this.sub = this.inputControl.valueChanges.subscribe((val) => {
            this.onChange(val);
            if (val == "") {
                this.resetItems();
            } else {
                this.items = this.items.filter((v) => v.fullName.match(new RegExp(val)));
            }
        });
    }

    items: Language[] = [];

    inputControl: FormControl = new FormControl();
    sub: Subscription;


    expand() { }

    select(value: Language) {
        this.writeValue(value.fullName)
    }

    resetItems() {
        this.items = this.service.getLanguages();
    }

    private onChange: (value: string) => void = () => { };

    private onTouched = () => {
        this.onChange(this.inputControl.value);
    };

    writeValue(value: any): void {
        this.inputControl.setValue(value, { emitEvent: true });
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void { }
}
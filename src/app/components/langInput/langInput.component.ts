import { Component, ElementRef, HostListener, QueryList, ViewChildren } from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { Subscription } from "rxjs";
import { Language } from "../../services/models/Language";
import { DictionaryService } from "../../services/dictionary.service";

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

    constructor(private service: DictionaryService) {
        this.items = this.service.getLanguages();
        this.sub = this.inputControl.valueChanges.subscribe((val: string) => {
            this.onChange(val);
            let value: string = val.toLowerCase();
            if (value == "") {
                this.resetItems();
            } else {
                this.showDdown = true;
                this.items = this.items.filter((v) => v.fullName.match(new RegExp(value)));
            }
        });
    }

    @ViewChildren("item")
    itemsRef!: QueryList<ElementRef<HTMLLIElement>>;
    lastHoveredItemIdx: number = -1;

    isError: boolean = false;
    textError: string = "";


    showDdown: boolean | undefined;
    items: Language[] = [];
    inputControl: FormControl = new FormControl();
    sub: Subscription;

    showError(err: string) {
        this.isError = true;
        this.textError = err;
        console.log(err);
    }

    hideError() {
        this.isError = false;
    }

    show() {
        this.showDdown = true;
    }

    select(value: Language) {
        this.writeValue(value.fullName);
        this.resetItems();
        this.showDdown = false;
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

    registerOnTouched(fn: any): void {
    }


    onKeyPress(e: KeyboardEvent) {
        let up = "ArrowUp";
        let down = "ArrowDown";
        let enter = "Enter";
        let pressedKey = e.key
        console.log(pressedKey);
        this.itemsRef.get(this.lastHoveredItemIdx)?.nativeElement.classList.remove("input-container__ddown-item--hoverable");
        if (pressedKey == up) {
            if (this.lastHoveredItemIdx > 0) {
                this.lastHoveredItemIdx--;
                let item = this.itemsRef.get(this.lastHoveredItemIdx);
                item?.nativeElement.classList.add("input-container__ddown-item--hoverable");
                item?.nativeElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                    inline: "end"
                });
            }
        } else if (pressedKey == down) {
            this.lastHoveredItemIdx == -1 ? this.lastHoveredItemIdx = 0 : this.lastHoveredItemIdx++;
            let item = this.itemsRef.get(this.lastHoveredItemIdx);
            item?.nativeElement.classList.add("input-container__ddown-item--hoverable");
            item?.nativeElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "end"
            });
        } else if (pressedKey == enter) {
            this.select(this.items[this.lastHoveredItemIdx]);
        }

    }

    @HostListener("focusout", ['$event.target'])
    focusOut(e: any) {
        this.showDdown = false;
    }

}
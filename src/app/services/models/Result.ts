export interface Mean {
    text: string;
}

export interface Synonym {

}

export interface TranslateRow {
    text: string
    pos: string // cуществи прилага
    gen: string // пол
    syn?: TranslateRow[]
    ts: string
    mean: Mean[]
}

export interface Translate {
    text: string
    pos: string
    ts?: string
    syn?: string
    tr: TranslateRow[]
}

export interface Result {
    head: {},
    def: Translate[]
}
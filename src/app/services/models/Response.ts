export interface Mean {
    text: string;
}

export interface Translate {
    text: string
    pos: string // cуществи прилага
    gen: string // пол
    mean: Mean[]
}

export interface Result {
    text: string
    pos?: string
    ts?: string
    tr: Translate[]
}

export interface Response {
    head: {},
    def: []
}
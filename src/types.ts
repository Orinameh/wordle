
export type Dictionary<T> = {[key: string]: T};

export enum GameState {
    PLAYING = 'PLAYING',
    WON = 'WON',
    LOST = 'LOST'
}
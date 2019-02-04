export type intervalType = "1min" | "5min" | "15min" | "30min" | "60min" | "1d";

export type ohlcPointType = {
    o: number,
    h: number,
    l: number,
    c: number,
    t: number
}

export type ohlcvPointType = {
    o: number,
    h: number,
    l: number,
    c: number,
    t: number,
    v: number
}
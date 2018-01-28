import { intervalType } from "./types"

export function getUnit(interval: intervalType): string {
    switch(interval) {
        case "1min":
        case "5min":
            return "minute";
        case "15min":
            return "hour";
        case "30min":
            return "hour";
        case "60min":
            return "day";
        default:
            return "hour";
    }
}
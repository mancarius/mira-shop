import { ZipCodebaseAddress } from "./zip-codebase-address";

export interface ZipCodebaseResponse {
    query: {
        codes: string[],
        country: string,
    },
    results: {
        [key: string]: ZipCodebaseAddress[]
    }
}

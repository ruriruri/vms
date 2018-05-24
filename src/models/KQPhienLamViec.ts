import { ApiKey } from "./ApiKey";

export class KQPhienLamViec {
    maKetQua?: string;
    APIKey?: ApiKey;
    constructor() {
        this.APIKey = new ApiKey();
    }
}
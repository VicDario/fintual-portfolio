import type HttpQueryModel from "../models/http.model.ts";

export interface IHttp {
    (input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

export interface IHttpClient {
    get<T>(httpQuery: HttpQueryModel): Promise<T>;
}

class HttpClient implements IHttpClient {
    private readonly _baseUrl: URL;

    constructor(baseUrl: string, private readonly _http: IHttp = fetch) {
        this._baseUrl = new URL(baseUrl);
    }

    async get<T>(httpQuery: HttpQueryModel): Promise<T> {
        const url = new URL(this._baseUrl.href + httpQuery.path);
        if (httpQuery.queryParams) {
            url.search = httpQuery.queryParams.toString();
        }
        const request = await this._http(url);
        if (!request.ok) throw new Error(`Something wrong happened`);
        const json = await request.json();
        return json;
    }
}

export default HttpClient;

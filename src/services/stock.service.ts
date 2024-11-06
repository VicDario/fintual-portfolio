import StockPriceQueryMapper from "../mappers/stock-price-query.mapper.ts";
import StockPriceModel from "../models/stock-price.model.ts";
import {
    isFuture,
    isWeekend,
    lightFormat,
    nextMonday,
    previousFriday,
    subBusinessDays,
} from "date-fns";
import HttpClient from "./http.service.ts";
import type { StockPriceResponse } from "../types/stock-price-response.type.ts";
import StockPriceResponseModel from "../models/stock-price-response.model.ts";
import type HttpQueryModel from "../models/http.model.ts";
import type { IMapper } from "../mappers/IMapper.ts";
import type { IHttpClient } from "./http.service.ts";
import StockPriceResponseMapper from "../mappers/stock-price-response.mapper.ts";

const http: IHttpClient = new HttpClient("https://fintual.cl/api");
const stockQueryMapper: IMapper<StockPriceModel, HttpQueryModel> =
    new StockPriceQueryMapper();
const stockPriceResponseMapper: IMapper<
    StockPriceResponse,
    StockPriceResponseModel
> = new StockPriceResponseMapper();

export interface IStockService {
    getPriceByDate: (
        model: StockPriceModel,
    ) => Promise<StockPriceResponseModel>;
}

class StockService implements IStockService {
    constructor(
        private readonly _http: IHttpClient = http,
        private _queryMapper: IMapper<StockPriceModel, HttpQueryModel> =
            stockQueryMapper,
        private _responseMapper: IMapper<
            StockPriceResponse,
            StockPriceResponseModel
        > = stockPriceResponseMapper,
    ) {}

    async getPriceByDate(
        model: StockPriceModel,
    ): Promise<StockPriceResponseModel> {
        model.date = this._getNearestBusinessDate(model.date);
        const queryModel = this._queryMapper.map(model);
        const response = await this._http.get<StockPriceResponse>(queryModel);
        if (response.data.length === 0) {
            model.date = subBusinessDays(model.date, 1);
        }
        return this._responseMapper.map(response);
    }

    private _getNearestBusinessDate(date: Date): Date {
        if (isWeekend(date)) {
            date = nextMonday(date);
        }
        if (isFuture(date)) {
            date = previousFriday(date);
        }
        return date;
    }
}

export default StockService;

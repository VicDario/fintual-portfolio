import StockPriceQueryMapper from "../mappers/stock-price-query.mapper.ts";
import StockPriceModel from "../models/stock-price.model.ts";
import HttpClient from "./http.service.ts";
import type { StockPriceResponse } from "../types/stock-price-response.type.ts";
import StockPriceResponseModel from "../models/stock-price-response.model.ts";
import type HttpQueryModel from "../models/http.model.ts";
import type { IMapper } from "../mappers/IMapper.ts";
import type { IHttpClient } from "./http.service.ts";
import StockPriceResponseMapper from "../mappers/stock-price-response.mapper.ts";
import DateUtils, { IDateUtils } from "../utils/date.utils.ts";

const http: IHttpClient = new HttpClient("https://fintual.cl/api");
const stockQueryMapper: IMapper<StockPriceModel, HttpQueryModel> =
    new StockPriceQueryMapper();
const stockPriceResponseMapper: IMapper<
    StockPriceResponse,
    StockPriceResponseModel
> = new StockPriceResponseMapper();

const dateUtils: IDateUtils = new DateUtils();

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
        private _dateUtils: IDateUtils = dateUtils,
    ) {}

    async getPriceByDate(
        model: StockPriceModel,
    ): Promise<StockPriceResponseModel> {
        model.date = this._getNearestBusinessDate(model.date);
        const queryModel = this._queryMapper.map(model);
        const response = await this._http.get<StockPriceResponse>(queryModel);
        if (response.data.length === 0) {
            model.date = this._dateUtils.subBusinessDays(model.date, 1);
            return this.getPriceByDate(model);
        }
        return this._responseMapper.map(response);
    }

    private _getNearestBusinessDate(date: Date): Date {
        if (this._dateUtils.isWeekend(date)) {
            date = this._dateUtils.nextMonday(date);
        }
        if (this._dateUtils.isFuture(date)) {
            date = this._dateUtils.previousFriday(date);
        }
        return date;
    }
}

export default StockService;

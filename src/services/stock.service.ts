import StockPriceQueryMapper from "../mappers/stock-price-query.mapper.ts";
import StockPriceModel from "../models/stock-price.model.ts";
import {
    isFuture,
    isWeekend,
    lightFormat,
    nextMonday,
    subBusinessDays,
    previousFriday
} from "date-fns";
import HttpClient from "./http.service.ts";
import type { StockPriceResponse } from "../types/stock-price-response.type.ts";
import StockPriceResponseModel from "../models/stock-price-response.model.ts";
import type HttpQueryModel from "../models/http.model.ts";
import type { IMapper } from "../mappers/IMapper.ts";
import type { IHttpClient } from "./http.service.ts";

const http: IHttpClient = new HttpClient("https://fintual.cl/api");
const stockQueryMapper: IMapper<StockPriceModel, HttpQueryModel> =
    new StockPriceQueryMapper();

export interface IStockService {
    getPriceByDate: (
        assetId: number,
        date: Date,
    ) => Promise<StockPriceResponseModel>;
}

class StockService implements IStockService {
    private readonly _dateFormat = "yyyy-MM-dd";

    async getPriceByDate(
        assetId: number,
        date: Date,
    ): Promise<StockPriceResponseModel> {
        date = this._getNearestBusinessDate(date);
        const model = new StockPriceModel({
            realAssetId: assetId,
            date: lightFormat(date, this._dateFormat),
        });
        const queryModel = stockQueryMapper.map(model);
        const response = await http.get<StockPriceResponse>(queryModel);
        if (response.data.length === 0) return this.getPriceByDate(assetId, subBusinessDays(date, 1))
        return new StockPriceResponseModel({
            ...response.data[0].attributes,
            assetId: parseInt(response.data[0].id),
        });
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

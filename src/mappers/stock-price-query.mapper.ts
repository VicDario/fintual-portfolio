import { lightFormat } from "date-fns";
import HttpQueryModel from "../models/http.model.ts";
import type StockPriceModel from "../models/stock-price.model.ts";
import { toSnakeCase } from "../utils/snake-case.util.ts";
import type { IMapper } from "./IMapper.ts";

class StockPriceQueryMapper
    implements IMapper<StockPriceModel, HttpQueryModel> {
    private readonly _dateFormat = "yyyy-MM-dd";

    map(model: StockPriceModel): HttpQueryModel {
        return new HttpQueryModel({
            path: this.getPath(model.realAssetId),
            queryParams: toSnakeCase({
                date: lightFormat(model.date, this._dateFormat),
            }),
        });
    }

    private getPath = (assetId: number): string =>
        `/real_assets/${assetId}/days`;
}

export default StockPriceQueryMapper;

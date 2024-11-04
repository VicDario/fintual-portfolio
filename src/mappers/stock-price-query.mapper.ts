import HttpQueryModel from "../models/http.model.ts";
import type StockPriceModel from "../models/stock-price.model.ts";
import { toSnakeCase } from "../utils/snake-case.util.ts";
import type { IMapper } from "./IMapper.ts";

class StockPriceQueryMapper
    implements IMapper<StockPriceModel, HttpQueryModel> {
    map(model: StockPriceModel): HttpQueryModel {
        return new HttpQueryModel({
            path: this.getPath(model.realAssetId),
            queryParams: toSnakeCase({ date: model.date }),
        });
    }

    private getPath = (assetId: number): string =>
        `/real_assets/${assetId}/days`;
}

export default StockPriceQueryMapper;

import StockPriceResponseModel from "../models/stock-price-response.model.ts";
import { StockPriceResponse } from "../types/stock-price-response.type.ts";
import type { IMapper } from "./IMapper.ts";

class StockPriceResponseMapper
    implements IMapper<StockPriceResponse, StockPriceResponseModel> {
    map(response: StockPriceResponse): StockPriceResponseModel {
        return new StockPriceResponseModel({
            ...response.data[0].attributes,
            assetId: parseInt(response.data[0].id),
        });
    }
}

export default StockPriceResponseMapper;

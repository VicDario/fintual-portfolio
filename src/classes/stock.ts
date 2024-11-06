import StockPriceModel from "../models/stock-price.model.ts";
import StockService, { IStockService } from "../services/stock.service.ts";

const stockService: IStockService = new StockService();

export interface IStock {
    assetId: number;
    amount: number;
    price(date: Date): Promise<number>;
}

class Stock implements IStock {
    assetId: number;
    amount: number;
    constructor(
        assetId: number,
        amount: number,
        private readonly _stockService: IStockService = stockService,
    ) {
        this.assetId = assetId;
        this.amount = amount;
    }

    async price(date: Date): Promise<number> {
        const model = new StockPriceModel({ realAssetId: this.assetId, date });
        const stockData = await this._stockService.getPriceByDate(model);
        return stockData.price;
    }
}

export default Stock;

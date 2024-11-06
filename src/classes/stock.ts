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
        try {
            const stockData = await this._stockService.getPriceByDate(
                this.assetId,
                date,
            );
            return stockData.price;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default Stock;

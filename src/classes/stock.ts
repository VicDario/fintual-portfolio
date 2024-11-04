import StockService, { IStockService } from "../services/stock.service.ts";

const stockService: IStockService = new StockService();

class Stock {
    assetId: number;
    amount: number;
    constructor(assetId: number, amount: number) {
        this.assetId = assetId;
        this.amount = amount;
    }

    async price(date: Date): Promise<number> {
        try {
            const stockData = await stockService.getPriceByDate(
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

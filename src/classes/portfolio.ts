import { IPortfolioService } from "../services/portfolio.service.ts";
import Stock from "./stock.ts";

export interface IPortfolio {
    addStock(assetId: number, amount: number): void;
    profit(dateStart: Date, dateEnd: Date): Promise<number>;
}

class Portfolio implements IPortfolio {
    private readonly _stocks: Stock[] = [];

    constructor(private readonly _portfolioService: IPortfolioService) {}

    addStock(assetId: number, amount: number): void {
        this._stocks.push(new Stock(assetId, amount));
    }

    async profit(dateStart: Date, dateEnd: Date): Promise<number> {
        const profit = await this._portfolioService.calculateProfit(
            this._stocks,
            dateStart,
            dateEnd,
        );
        return profit;
    }
}

export default Portfolio;

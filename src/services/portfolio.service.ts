import { IStock } from "../classes/stock.ts";

export interface IPortfolioService {
    calculateProfit(
        stocks: IStock[],
        dateStart: Date,
        dateEnd: Date,
    ): Promise<number>;
}

class PortfolioService implements IPortfolioService {
    async calculateProfit(
        stocks: IStock[],
        dateStart: Date,
        dateEnd: Date,
    ): Promise<number> {
        const stocksData = await Promise.allSettled(
            stocks.map(async (stock) => ({
                amount: stock.amount,
                valueStart: await stock.price(dateStart),
                valueEnd: await stock.price(dateEnd),
            })),
        );
        let profit = 0;
        for (const stockData of stocksData) {
            if (stockData.status !== "fulfilled") continue;
            const { amount, valueStart, valueEnd } = stockData.value;
            const stockProfit = amount * (valueEnd - valueStart);
            profit += stockProfit;
        }
        return profit;
    }
}

export default PortfolioService;

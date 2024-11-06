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
                initialValue: await stock.price(dateStart),
                finalValue: await stock.price(dateEnd),
            })),
        );
        let profit = 0;
        for (const stockData of stocksData) {
            if (stockData.status !== "fulfilled") continue;
            const { amount, initialValue, finalValue } = stockData.value;
            profit += this.calculateStockProfit(
                amount,
                initialValue,
                finalValue,
            );
        }
        return profit;
    }

    calculateStockProfit = (
        stockAmount: number,
        initialValue: number,
        finalValue: number,
    ): number => stockAmount * (finalValue - initialValue); // JS things can be resolve with a safe currrency library :D
}

export default PortfolioService;

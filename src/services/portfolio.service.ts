import { IStock } from "../classes/stock.ts";
import { IMapper } from "../mappers/IMapper.ts";
import PortfolioProfitModel from "../models/portfolio-profit.model.ts";
import PortflioProfitMapper, {
    PortfolioProfitMapperParams,
} from "../mappers/portfolio-profit.mapper.ts";
import DateUtils from "../utils/date.utils.ts";

const mapper = new PortflioProfitMapper();
const dateUtils = new DateUtils();

export interface IPortfolioService {
    calculateProfit(
        stocks: IStock[],
        dateStart: Date,
        dateEnd: Date,
    ): Promise<PortfolioProfitModel>;
}

class PortfolioService implements IPortfolioService {
    constructor(
        private readonly _mapper: IMapper<
            PortfolioProfitMapperParams,
            PortfolioProfitModel
        > = mapper,
        private readonly _dateUtils: DateUtils = dateUtils,
    ) {}

    async calculateProfit(
        stocks: IStock[],
        dateStart: Date,
        dateEnd: Date,
    ): Promise<PortfolioProfitModel> {
        const stocksData = await Promise.allSettled(
            stocks.map(async (stock) => ({
                amount: stock.amount,
                initialValue: await stock.price(dateStart),
                finalValue: await stock.price(dateEnd),
            })),
        );
        const data = {
            profit: 0,
            initialMoney: 0,
            finalMoney: 0,
        };
        for (const stockData of stocksData) {
            if (stockData.status !== "fulfilled") continue; // Check
            const { amount, initialValue, finalValue } = stockData.value;
            data.initialMoney += initialValue;
            data.finalMoney += finalValue;
            data.profit += this.calculateStockProfit(
                amount,
                initialValue,
                finalValue,
            );
        }
        const annualizedReturn = this.calculateAnnualizedReturn(
            data.initialMoney,
            data.finalMoney,
            dateStart,
            dateEnd,
        );
        return this._mapper.map({ profit: data.profit, annualizedReturn });
    }

    calculateStockProfit = (
        stockAmount: number,
        initialValue: number,
        finalValue: number,
    ): number => stockAmount * (finalValue - initialValue); // JS things can be resolve with a safe currrency library :D

    calculateAnnualizedReturn(
        initialValue: number,
        finalValue: number,
        dateStart: Date,
        dateEnd: Date,
    ): number {
        const days = this._dateUtils.differenceInDays(dateStart, dateEnd);
        const comulativeReturn = this._calculateCumulativeReturn(
            initialValue,
            finalValue,
        );
        return Math.pow(1 + comulativeReturn, 365 / days) - 1;
    }

    private _calculateCumulativeReturn(
        initialMoney: number,
        finalMoney: number,
    ): number {
        return (finalMoney - initialMoney) / initialMoney;
    }
}

export default PortfolioService;

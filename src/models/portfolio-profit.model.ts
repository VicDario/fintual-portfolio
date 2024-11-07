type PortfolioProfitModelParams = {
    profit: number;
    annualizedReturn: string;
};

class PortfolioProfitModel {
    profit: number;
    annualizedReturn: string;

    constructor({ profit, annualizedReturn }: PortfolioProfitModelParams) {
        this.profit = profit;
        this.annualizedReturn = annualizedReturn;
    }
}

export default PortfolioProfitModel;

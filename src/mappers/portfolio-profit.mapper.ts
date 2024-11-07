import PortfolioProfitModel from "../models/portfolio-profit.model.ts";
import type { IMapper } from "./IMapper.ts";

export type PortfolioProfitMapperParams = {
    profit: number;
    annualizedReturn: number;
};

class PortfolioProfitMapper
    implements IMapper<PortfolioProfitMapperParams, PortfolioProfitModel> {
    map(params: PortfolioProfitMapperParams): PortfolioProfitModel {
        return new PortfolioProfitModel({
            profit: params.profit,
            annualizedReturn: this._formatAnnualizedReturn(
                params.annualizedReturn,
            ),
        });
    }

    private _formatAnnualizedReturn(annualizedReturn: number): string {
        return `${(annualizedReturn * 10).toFixed(2)}%`;
    }
}

export default PortfolioProfitMapper;

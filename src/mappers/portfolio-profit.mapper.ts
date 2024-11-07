import PortfolioProfitModel from "../models/portfolio-profit.model.ts";
import type { IMapper } from "./IMapper.ts";

export type PortfolioProfitMapperParams = {
    profit: number;
    annualizedReturn: number;
};

class PortfolioProfitMapper
    implements IMapper<PortfolioProfitMapperParams, PortfolioProfitModel> {

   private _decimals: number = 2; 

    map(params: PortfolioProfitMapperParams): PortfolioProfitModel {
        return new PortfolioProfitModel({
            profit: params.profit,
            annualizedReturn: this._formatAnnualizedReturn(
                params.annualizedReturn,
            ),
        });
    }

    private _formatAnnualizedReturn(annualizedReturn: number): string {
        return `${(annualizedReturn * 100).toFixed(this._decimals)}%`;
    }
}

export default PortfolioProfitMapper;

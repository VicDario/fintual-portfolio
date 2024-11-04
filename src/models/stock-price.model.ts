type StockPriceModelParams = {
    realAssetId: number;
    date: string;
};

class StockPriceModel {
    realAssetId: number;
    date: string;

    constructor(params: StockPriceModelParams) {
        this.realAssetId = params.realAssetId;
        this.date = params.date;
    }
}

export default StockPriceModel;

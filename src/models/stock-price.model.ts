type StockPriceModelParams = {
    realAssetId: number;
    date: Date;
};

class StockPriceModel {
    realAssetId: number;
    date: Date;

    constructor(params: StockPriceModelParams) {
        this.realAssetId = params.realAssetId;
        this.date = params.date;
    }
}

export default StockPriceModel;

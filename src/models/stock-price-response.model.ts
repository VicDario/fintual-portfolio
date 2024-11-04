type StockPriceResponseModelParams = {
    assetId: number;
    date: string;
    price: number;
};

class StockPriceResponseModel {
    assetId: number;
    price: number;
    date: string;

    constructor(params: StockPriceResponseModelParams) {
        this.assetId = params.assetId;
        this.price = params.price;
        this.date = params.date;
    }
}

export default StockPriceResponseModel;

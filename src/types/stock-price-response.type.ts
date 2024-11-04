export interface StockPriceResponse {
    data: StockPriceData[];
}

interface StockPriceData {
    id: string;
    type: string;
    attributes: StockPriceAttributes;
}

export interface StockPriceAttributes {
    date: string;
    price: number;
    adjusted_close_price: number;
    adjusted_close_price_type: string;
    high_price: number;
    high_price_type: string;
    low_price: number;
    low_price_type: string;
    net_asset_value: number;
    net_asset_value_type: string;
    open_price: number;
    open_price_type: string;
    volume: number;
    volume_type: string;
    dividend: number;
    dividend_type: string;
    split: number;
    split_type: string;
}

import { assertEquals, assertInstanceOf } from "jsr:@std/assert";
import { faker } from "@faker-js/faker";
import type { IMapper } from "./IMapper.ts";
import StockPriceResponseMapper from "./stock-price-response.mapper.ts";
import { StockPriceResponse } from "../types/stock-price-response.type.ts";
import StockPriceResponseModel from "../models/stock-price-response.model.ts";

Deno.test("StockPriceResponseMapper", async (t) => {
    await t.step("Map a valid StockPriceResponse instance", () => {
        const id = faker.number.int();
        const date = faker.date.anytime().toDateString();
        const price = faker.number.float();
        const input: StockPriceResponse = {
            data: [{
                type: faker.commerce.productAdjective(),
                id: id.toString(),
                attributes: {
                    assetId: id,
                    price,
                    date,
                    // deno-lint-ignore no-explicit-any
                } as any,
            }],
        };
        const mapper: IMapper<StockPriceResponse, StockPriceResponseModel> =
            new StockPriceResponseMapper();

        const model = mapper.map(input);

        assertInstanceOf(model, StockPriceResponseModel);
        assertEquals(model.assetId, id);
        assertEquals(model.date, date);
    });
});

import { assertEquals, assertInstanceOf } from "jsr:@std/assert";
import { faker } from "@faker-js/faker";
import StockPriceQueryMapper from "./stock-price-query.mapper.ts";
import HttpQueryModel from "../models/http.model.ts";
import StockPriceModel from "../models/stock-price.model.ts";
import type { IMapper } from "./IMapper.ts";

Deno.test("StockPriceQueryMapper", async (t) => {
    await t.step("Map a valid HttpQueryModel instance", () => {
        const realAssetId = faker.number.int();
        const date = faker.date.anytime().toLocaleString();
        const model = new StockPriceModel({ realAssetId, date });
        const mapper: IMapper<StockPriceModel, HttpQueryModel> =
            new StockPriceQueryMapper();

        const query = mapper.map(model);

        assertInstanceOf(query, HttpQueryModel);
        assertEquals(query.path, `/real_assets/${model.realAssetId}/days`);
        assertEquals(query.queryParams.get("date"), date);
    });
});

import { assertEquals, assertInstanceOf } from "jsr:@std/assert";
import { faker } from "@faker-js/faker";
import PortfolioProfitMapper, { PortfolioProfitMapperParams } from "./portfolio-profit.mapper.ts";
import type { IMapper } from "./IMapper.ts";
import PortfolioProfitModel from "../models/portfolio-profit.model.ts";

Deno.test("PortfolioProfitMapper", async (t) => {
    await t.step("Map a valid HttpQueryModel instance", () => {
        const annualizedReturn = faker.number.float();
        const profit = faker.number.float();
        const input: PortfolioProfitMapperParams = {
            annualizedReturn,
            profit 
        };
        const expectedAnnualizedReturn = `${(annualizedReturn * 100).toFixed(2)}%`
        const mapper: IMapper<PortfolioProfitMapperParams, PortfolioProfitModel> =
            new PortfolioProfitMapper();

        const model = mapper.map(input);

        assertInstanceOf(model, PortfolioProfitModel);
        assertEquals(model.profit, profit);
        assertEquals(model.annualizedReturn, expectedAnnualizedReturn)
    });
});

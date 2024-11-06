import { assertAlmostEquals, assertEquals, assertInstanceOf } from "@std/assert";
import PortfolioService from "./portfolio.service.ts";
import { assertSpyCalls, spy, stub } from "jsr:@std/testing/mock";
import { faker } from "@faker-js/faker";
import { IStock } from "../classes/stock.ts";

Deno.test("PortfolioService", async (t) => {
    const service = new PortfolioService();
    
    await t.step("Create a valid PortfolioService", () => {
        assertInstanceOf(service, PortfolioService);
    });

    await t.step("Correct calls functions", async () => {
        const expectedProfit = faker.number.float();
        const calculateStockProfitSpy = spy(() => expectedProfit)
        const stockProfitStub = stub(service, "calculateStockProfit", calculateStockProfitSpy)
        const dateStart = faker.date.past({ years: 1 });
        const dateEnd = faker.date.recent();
        const priceSpy = spy(faker.number.int);
        const stock: IStock = {
            assetId: 1,
            amount: 2,
            // deno-lint-ignore no-explicit-any
            price: priceSpy as any
        };
        const stocks = [stock, stock];

        const result = await service.calculateProfit(stocks, dateEnd, dateStart);

        assertSpyCalls(priceSpy, 4);
        assertSpyCalls(calculateStockProfitSpy, 2);
        assertEquals(result, expectedProfit * 2);
        stockProfitStub.restore();
    });

    await t.step("'Correct' profits calculation", () => {
        assertAlmostEquals(service.calculateStockProfit(1, 2, 2), 0);
        assertAlmostEquals(service.calculateStockProfit(1, 2, 3), 1);
        assertAlmostEquals(service.calculateStockProfit(1, 2, 4), 2);
        assertAlmostEquals(service.calculateStockProfit(1.5, 2, 4), 3);
        assertAlmostEquals(service.calculateStockProfit(12.7, 45.6, 80.3), 440.69);
    });
});
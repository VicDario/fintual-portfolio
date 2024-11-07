import {
    assertAlmostEquals,
    assertEquals,
    assertInstanceOf,
} from "@std/assert";
import PortfolioService from "./portfolio.service.ts";
import { assertSpyCalls, spy, stub } from "jsr:@std/testing/mock";
import { faker } from "@faker-js/faker";
import { IStock } from "../classes/stock.ts";
import DateUtils from "../utils/date.utils.ts";
import PortfolioProfitMapper from "../mappers/portfolio-profit.mapper.ts";


Deno.test("PortfolioService", async (t) => {
    const dateUtils = new DateUtils();
    const mapper = new PortfolioProfitMapper();
    const service = new PortfolioService(mapper, dateUtils);

    await t.step("Create a valid PortfolioService", () => {
        assertInstanceOf(service, PortfolioService);
    });

    await t.step("Correct calls functions", async () => {
        const expectedProfit = faker.number.float();
        const calculateStockProfitSpy = spy(() => expectedProfit);
        const stockProfitStub = stub(
            service,
            "calculateStockProfit",
            calculateStockProfitSpy,
        );
        const expectedAnnualizedReturn = faker.number.float();
        const calculateAnnualizedSpy = spy(() => expectedAnnualizedReturn);
        const AnnualizedReturnStub = stub(service, "calculateAnnualizedReturn", calculateAnnualizedSpy);
        const dateStart = faker.date.past({ years: 1 });
        const dateEnd = faker.date.recent();
        const priceSpy = spy(faker.number.int);
        const stock: IStock = {
            assetId: 1,
            amount: 2,
            // deno-lint-ignore no-explicit-any
            price: priceSpy as any,
        };
        const stocks = [stock, stock];

        const result = await service.calculateProfit(
            stocks,
            dateEnd,
            dateStart,
        );

        assertSpyCalls(priceSpy, 4);
        assertSpyCalls(calculateStockProfitSpy, 2);
        assertSpyCalls(calculateAnnualizedSpy, 1);
        assertEquals(result.profit, expectedProfit * 2);

        stockProfitStub.restore();
        AnnualizedReturnStub.restore()
    });

    await t.step("'Correct' profits calculation", () => {
        assertAlmostEquals(service.calculateStockProfit(1, 2, 2), 0);
        assertAlmostEquals(service.calculateStockProfit(1, 2, 3), 1);
        assertAlmostEquals(service.calculateStockProfit(1, 2, 4), 2);
        assertAlmostEquals(service.calculateStockProfit(1.5, 2, 4), 3);
        assertAlmostEquals(
            service.calculateStockProfit(12.7, 45.6, 80.3),
            440.69,
        );
    });

    await t.step("calculateAnnualizedReturn should return correct annualized return for positive gain", () => {
        const days = 365;
        const differenceInDaysSpy = spy(() => days);
        const dateUtilsStub = stub(dateUtils, "differenceInDays", differenceInDaysSpy);
        const date = faker.date.anytime();
        const initialValue = 100;
        const finalValue = 150;

        assertEquals(service.calculateAnnualizedReturn(initialValue, finalValue, date, date), 0.5);
        assertSpyCalls(differenceInDaysSpy, 1);

        dateUtilsStub.restore();
    });

    await t.step("calculateAnnualizedReturn should return correct negative annualized return", () => {
        const days = 365;
        const differenceInDaysSpy = spy(() => days);
        const dateUtilsStub = stub(dateUtils, "differenceInDays", differenceInDaysSpy);
        const date = faker.date.anytime();
        const initialValue = 150;
        const finalValue = 100;

        assertEquals(service.calculateAnnualizedReturn(initialValue, finalValue, date, date).toFixed(2), '-0.33');
        assertSpyCalls(differenceInDaysSpy, 1);

        dateUtilsStub.restore();
    });

    await t.step("calculateAnnualizedReturn should return zero for no gain or loss", () => {
        const days = 365;
        const differenceInDaysSpy = spy(() => days);
        const dateUtilsStub = stub(dateUtils, "differenceInDays", differenceInDaysSpy);
        const date = faker.date.anytime();
        const initialValue = 100;
        const finalValue = 100;

        assertEquals(service.calculateAnnualizedReturn(initialValue, finalValue, date, date), 0);
        assertSpyCalls(differenceInDaysSpy, 1);

        dateUtilsStub.restore();
    });
});

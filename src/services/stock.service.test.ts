import { assertEquals, assertInstanceOf } from "@std/assert";
import StockService from "./stock.service.ts";
import {
    assertSpyCall,
    assertSpyCalls,
    spy,
    stub,
} from "jsr:@std/testing/mock";
import HttpClient from "./http.service.ts";
import { faker } from "@faker-js/faker";
import StockPriceModel from "../models/stock-price.model.ts";
import StockPriceResponseMapper from "../mappers/stock-price-response.mapper.ts";
import StockPriceQueryMapper from "../mappers/stock-price-query.mapper.ts";
import { IMapper } from "../mappers/IMapper.ts";
import HttpQueryModel from "../models/http.model.ts";
import StockPriceResponseModel from "../models/stock-price-response.model.ts";
import { StockPriceResponse } from "../types/stock-price-response.type.ts";
import DateUtils from "../utils/date.utils.ts";

Deno.test("StockService", async (t) => {
    const url = faker.internet.url();
    const http = new HttpClient(url);
    const queryMapper: IMapper<StockPriceModel, HttpQueryModel> =
        new StockPriceQueryMapper();
    const responseMapper: IMapper<StockPriceResponse, StockPriceResponseModel> =
        new StockPriceResponseMapper();
    const dateUtils = new DateUtils();
    const date = faker.date.past();
    const assetId = faker.number.int();
    const model = new StockPriceModel({
        realAssetId: assetId,
        date,
    });
    const service = new StockService(
        http,
        queryMapper,
        responseMapper,
        dateUtils,
    );

    await t.step("Create a valid StockService", () => {
        assertInstanceOf(new StockService(), StockService);
    });

    await t.step("Correct calls functions when weekday", async () => {
        const getResponse = { data: [{ lorem: faker.lorem.sentence() }] };
        const getSpy = spy(() => Promise.resolve(getResponse));
        const httpStub = stub(http, "get", getSpy);

        const queryMapperResponse = { path: `/${faker.lorem.word()}` };
        const queryMapperSpy = spy(() => queryMapperResponse);
        // deno-lint-ignore no-explicit-any
        const queryMapperStub = stub(queryMapper, "map", queryMapperSpy as any);
        const responseExpected = { price: faker.number.float() };
        const responseMapperSpy = spy(() => responseExpected);
        // deno-lint-ignore no-explicit-any
        const responseMapperStub = stub(
            responseMapper,
            "map",
            responseMapperSpy as any,
        );
        const isWeekendSpy = spy(() => false);
        const isFutureSpy = spy(() => false);
        const weekendStub = stub(dateUtils, "isWeekend", isWeekendSpy);
        const futureStub = stub(dateUtils, "isFuture", isFutureSpy);

        const response = await service.getPriceByDate(model);

        assertSpyCall(isWeekendSpy, 0, { args: [date] });
        assertSpyCalls(isWeekendSpy, 1);
        assertSpyCall(isFutureSpy, 0, { args: [date] });
        assertSpyCalls(isFutureSpy, 1);
        assertSpyCall(queryMapperSpy, 0, { args: [model] });
        assertSpyCalls(queryMapperSpy, 1);
        assertSpyCall(getSpy, 0, { args: [queryMapperResponse] });
        assertSpyCalls(getSpy, 1);
        assertSpyCall(responseMapperSpy, 0, { args: [getResponse] });
        assertSpyCalls(responseMapperSpy, 1);
        assertEquals(response, responseExpected);

        httpStub.restore();
        queryMapperStub.restore();
        responseMapperStub.restore();
        futureStub.restore();
        weekendStub.restore();
    });

    await t.step(
        "Correct recursive calls when http response is empty",
        async () => {
            function* responseGenerator() {
                yield { data: [] };
                yield { data: [] };
                yield { data: [{ lorem: faker.lorem.sentence() }] };
            }
            const response = responseGenerator();
            const getSpy = spy(() => Promise.resolve(response.next().value));
            const httpStub = stub(http, "get", getSpy);

            const queryMapperResponse = { path: `/${faker.lorem.word()}` };
            const queryMapperSpy = spy(() => queryMapperResponse);
            // deno-lint-ignore no-explicit-any
            const queryMapperStub = stub(
                queryMapper,
                "map",
                queryMapperSpy as any,
            );
            const responseExpected = { price: faker.number.float() };
            const responseMapperSpy = spy(() => responseExpected);
            // deno-lint-ignore no-explicit-any
            const responseMapperStub = stub(
                responseMapper,
                "map",
                responseMapperSpy as any,
            );
            const isWeekendSpy = spy(() => false);
            const isFutureSpy = spy(() => false);
            const weekendStub = stub(dateUtils, "isWeekend", isWeekendSpy);
            const futureStub = stub(dateUtils, "isFuture", isFutureSpy);

            await service.getPriceByDate(model);

            assertSpyCalls(isWeekendSpy, 3);
            assertSpyCalls(isFutureSpy, 3);
            assertSpyCalls(queryMapperSpy, 3);
            assertSpyCalls(getSpy, 3);
            assertSpyCalls(responseMapperSpy, 1);

            httpStub.restore();
            queryMapperStub.restore();
            responseMapperStub.restore();
            futureStub.restore();
            weekendStub.restore();
        },
    );
});

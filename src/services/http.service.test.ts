// deno-lint-ignore-file require-await
import {
    assert,
    assertInstanceOf,
    assertObjectMatch,
    assertRejects,
} from "jsr:@std/assert";
import { assertSpyCalls, spy, stub } from "jsr:@std/testing/mock";
import { faker } from "@faker-js/faker";
import HttpClient from "./http.service.ts";
import HttpQueryModel from "../models/http.model.ts";

Deno.test("HttpClient", async (t) => {
    await t.step("Create a valid HttpClient", () => {
        assertInstanceOf(new HttpClient(faker.internet.url()), HttpClient);
    });

    await t.step("Get - returns data correctly", async () => {
        const resultMock = {
            data: {
                animal: faker.animal.rabbit(),
                fruit: faker.food.fruit(),
            },
        };
        const jsonSpy = spy(() => resultMock);
        const httpMock = spy(async () =>
            ({
                ok: true,
                // deno-lint-ignore no-explicit-any
                json: jsonSpy as () => any,
            }) as Response
        );
        const stubFetch = stub(globalThis, "fetch", httpMock);
        const url = faker.internet.url();
        const client = new HttpClient(url, stubFetch);

        try {
            const result = await client.get<object>({} as HttpQueryModel);
            assertSpyCalls(httpMock, 1);
            assertSpyCalls(jsonSpy, 1);
            assertObjectMatch(result, resultMock);
        } finally {
            stubFetch.restore();
        }
    });

    await t.step("Get - adds query params", async () => {
        const httpMock = spy(async () =>
            ({
                ok: true,
                json: async () => {},
            }) as Response
        );
        const stubFetch = stub(globalThis, "fetch", httpMock);
        const url = faker.internet.url();
        const client = new HttpClient(url, stubFetch);
        const cat = faker.animal.cat();
        const color = faker.color.human();
        const query = new HttpQueryModel({
            path: "",
            queryParams: { cat, color },
        });

        try {
            await client.get(query);
            assertSpyCalls(httpMock, 1);
            const hasQueryParams = httpMock.calls[0].args.some((url) =>
                (url as URL)?.search ===
                    `?cat=${cat.split(" ").join("+")}&color=${color}`
            );
            assert(hasQueryParams);
        } finally {
            stubFetch.restore();
        }
    });

    await t.step("Get - throws error when 400", async () => {
        const jsonSpy = spy(() => null);
        const httpMock = spy(async () =>
            ({
                ok: false,
                // deno-lint-ignore no-explicit-any
                json: jsonSpy as any,
            }) as Response
        );
        const stubFetch = stub(globalThis, "fetch", httpMock);
        const url = faker.internet.url();
        const client = new HttpClient(url, stubFetch);

        await assertRejects(() => client.get({} as HttpQueryModel));
        assertSpyCalls(httpMock, 1);
        assertSpyCalls(jsonSpy, 0);
        stubFetch.restore();
    });
});

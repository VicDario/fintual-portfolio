import { assertEquals } from "jsr:@std/assert";
import { faker } from "@faker-js/faker";
import { toSnakeCase } from "./snake-case.util.ts";

Deno.test("SnakeCaseUtil", async (t) => {
    await t.step("toSnakeCase - returns a transformed record", () => {
        const animalName = faker.animal.insect();
        const dateToCheck = faker.date.anytime().toLocaleString();
        const numberToTest = faker.number.int();
        const originalObject = { animalName, dateToCheck, numberToTest };

        const result = toSnakeCase(originalObject);

        assertEquals(originalObject.animalName, result["animal_name"]);
        assertEquals(originalObject.dateToCheck, result["date_to_check"]);
        assertEquals(
            originalObject.numberToTest.toString(),
            result["number_to_test"],
        );
    });

    await t.step("toSnakeCase - handles empty object", () => {
        const input = {};
        const expectedOutput = {};
        const result = toSnakeCase(input);
        assertEquals(result, expectedOutput);
    });

    await t.step(
        "toSnakeCase - leaves already snake_case keys unchanged",
        () => {
            const input = {
                first_name: faker.person.firstName(),
            };

            const result = toSnakeCase(input);
            assertEquals(result, input);
        },
    );
});

import request from "supertest";
import mongoose from "mongoose";
import ItemModel from "../models/item.model";

import app from "../app";

let lastGeneratedItemNumber = 0;

// Writes 100 example items to the database for testing
async function initializeDatabase() {
  for (let index = 0; index < 100; index++) {
    const item = {
      serial: `ABC-${lastGeneratedItemNumber}`,
      description: `Test description for Item Nr. ${lastGeneratedItemNumber}`,
      count: 0,
    };

    lastGeneratedItemNumber++;

    await ItemModel.create(item);
  }
}

function generateItem() {
  const item = {
    serial: `ABC-${lastGeneratedItemNumber}`,
    description: `Test description for Item Nr. ${lastGeneratedItemNumber}`,
    count: 0,
  };

  lastGeneratedItemNumber++;

  return item;
}

beforeAll(async function () {
  await mongoose.connect(`${process.env.MONGO_URI}${process.env.MONGO_DB}`);
  await initializeDatabase();
});

afterAll(async function () {
  await mongoose.connection.close();
});

describe("Tests the /item endpoint", () => {
  describe("GET /item", () => {
    // Status codes
    it("Should return a status code 200 on a successful response", async () => {
      const response = await request(app).get("/item").send();

      expect(response.statusCode).toStrictEqual(200);
    });

    it("Should return a status code 400 when called with ?skip={non-number}", async () => {
      const response = await request(app).get("/item?skip=abc").send();

      expect(response.statusCode).toStrictEqual(400);
      expect(response.type).toStrictEqual("application/json");
      expect(response.body).toContain("Bad input parameter");
    });

    it("Should return a status code 400 when called with ?skip={less-than-zero}", async () => {
      const response = await request(app).get("/item?skip=-1").send();

      expect(response.statusCode).toStrictEqual(400);
      expect(response.type).toStrictEqual("application/json");
      expect(response.body).toContain("Bad input parameter");
    });

    it("Should return a status code 400 when called with ?limit={non-number}", async () => {
      const response = await request(app).get("/item?limit=abc").send();

      expect(response.statusCode).toStrictEqual(400);
      expect(response.type).toStrictEqual("application/json");
      expect(response.body).toContain("Bad input parameter");
    });

    it("Should return a status code 400 when called with ?limit={less-than-zero}", async () => {
      const response = await request(app).get("/item?limit=-1").send();

      expect(response.statusCode).toStrictEqual(400);
      expect(response.type).toStrictEqual("application/json");
      expect(response.body).toContain("Bad input parameter");
    });

    it("Should return a status code 400 when called with ?limit={greater-than-max}", async () => {
      const response = await request(app).get("/item?limit=75").send();

      expect(response.statusCode).toStrictEqual(400);
      expect(response.type).toStrictEqual("application/json");
      expect(response.body).toContain("Bad input parameter");
    });

    // Return values, skip parameter
    it("Should return the first 25 items of the database when called with ?skip not defined", async () => {
      const response = await request(app).get("/item");

      expect(response.statusCode).toStrictEqual(200);
      expect(response.type).toStrictEqual("application/json");
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            serial: "ABC-0",
            description: "Test description for Item Nr. 0",
            count: 0,
          }),
        ])
      );
    });

    it("Should return the first 25 items of the database when called with ?skip=0", async () => {
      const response = await request(app).get("/item?skip=0");

      expect(response.statusCode).toStrictEqual(200);
      expect(response.type).toStrictEqual("application/json");
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            serial: "ABC-0",
            description: "Test description for Item Nr. 0",
            count: 0,
          }),
        ])
      );
    });

    it("Should return the items 25-49 (zero-based) inclusive of the database when called with ?skip=25", async () => {
      const response = await request(app).get("/item?skip=25");

      expect(response.statusCode).toStrictEqual(200);
      expect(response.type).toStrictEqual("application/json");
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            serial: "ABC-25",
            description: "Test description for Item Nr. 25",
            count: 0,
          }),
        ])
      );
    });

    // Return values, limit parameter
    it("Should return a maximum of 25 items of the database when called with ?limit not defined", async () => {
      const response = await request(app).get("/item");

      expect(response.statusCode).toStrictEqual(200);
      expect(response.type).toStrictEqual("application/json");
      expect(response.body).toHaveLength(25);
    });

    it("Should return a maximum of 25 items of the database when called with ?limit=25", async () => {
      const response = await request(app).get("/item?limit=25");

      expect(response.statusCode).toStrictEqual(200);
      expect(response.type).toStrictEqual("application/json");
      expect(response.body).toHaveLength(25);
    });

    it("Should return a maximum of 50 items of the database when called with ?limit=50", async () => {
      const response = await request(app).get("/item?limit=50");

      expect(response.statusCode).toStrictEqual(200);
      expect(response.type).toStrictEqual("application/json");
      expect(response.body).toHaveLength(50);
    });
  });

  describe("POST /item", () => {
    it("Should return a 201 status code on successful item creation", async () => {
      const item = generateItem();
      const response = await request(app)
        .post("/item")
        .type("application/json")
        .send(item);

      expect(response.statusCode).toStrictEqual(201);
      expect(response.type).toStrictEqual("application/json");
    });

    it("Should return a 400 status code when called with an empty body", async () => {
      const response = await request(app)
        .post("/item")
        .type("application/json")
        .send();

      expect(response.statusCode).toStrictEqual(400);
      expect(response.type).toStrictEqual("application/json");
      expect(response.body).toContain("Invalid item");
    });

    it("Should return a 400 status code when called with an invalid body", async () => {
      const response = await request(app)
        .post("/item")
        .type("application/json")
        .send({ serial: 0 });

      expect(response.statusCode).toStrictEqual(400);
      expect(response.type).toStrictEqual("application/json");
      expect(response.body).toContain("Invalid item");
    });

    it("Should return a 409 status code when called with a body that already exists", async () => {
      const item = generateItem();
      let response = await request(app)
        .post("/item")
        .type("application/json")
        .send(item);

      expect(response.statusCode).toStrictEqual(201);
      expect(response.type).toStrictEqual("application/json");

      response = await request(app)
        .post("/item")
        .type("application/json")
        .send(item);

      expect(response.statusCode).toStrictEqual(409);
      expect(response.type).toStrictEqual("application/json");
      expect(response.body).toContain("Item already exists");
    });

    it("Should return the item created in the body", async () => {
      const item = generateItem();

      const response = await request(app)
        .post("/item")
        .type("application/json")
        .send(item);

      expect(response.statusCode).toStrictEqual(201);
      expect(response.type).toStrictEqual("application/json");
      expect(response.body).toEqual(expect.objectContaining(item));
    });
  });
});

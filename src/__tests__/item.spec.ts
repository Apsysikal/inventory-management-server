import request from "supertest";

import app from "../app";

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
      throw new Error("Test not defined");
    });

    it("Should return the first 25 items of the database when called with ?skip=0", async () => {
      throw new Error("Test not defined");
    });

    it("Should return the items 26-50 inclusive of the database when called with ?skip=25", async () => {
      throw new Error("Test not defined");
    });

    // Return values, limit parameter
    it("Should return a maximum of 25 items of the database when called with ?limit not defined", async () => {
      throw new Error("Test not defined");
    });

    it("Should return a maximum of 25 items of the database when called with ?limit=25", async () => {
      throw new Error("Test not defined");
    });

    it("Should return a maximum of 50 items of the database when called with ?limit=50", async () => {
      throw new Error("Test not defined");
    });
  });
});

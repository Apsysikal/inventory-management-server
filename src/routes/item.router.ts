import { Request, Response, Router } from "express";

// /item
const router = Router();

function parseSkipFromQuery(query: string | undefined): number {
  let skip = 0;

  // Return skip when no query is defined
  if (!query) return skip;

  // Throw an error, when query cant be parsed into a number
  if (!Number(query)) throw new Error("Query cannot be parsed into number");

  skip = Number(query);

  if (skip < 0) throw new Error("Skip cannot be less than zero");

  return skip;
}

function parseLimitFromQuery(query: string | undefined): number {
  let limit = 25;

  if (!query) return limit;
  if (!Number(query)) throw new Error("Query cannot be parsed into number");

  limit = Number(query);

  if (limit < 0) throw new Error("Skip cannot be less than zero");
  if (limit > 50) throw new Error("Skip cannot be greater than 50");

  return limit;
}

router.get("/", async function (req: Request, res: Response) {
  let { skip, limit } = req.query;

  try {
    const skipNumber = parseSkipFromQuery(skip as string);
  } catch (error) {
    return res
      .status(400)
      .contentType("application/json")
      .json("Bad input parameter")
      .end();
  }

  try {
    const limitNumber = parseLimitFromQuery(limit as string);
  } catch (error) {
    return res
      .status(400)
      .contentType("application/json")
      .json("Bad input parameter")
      .end();
  }

  return res.status(200).end();
});

export default router;

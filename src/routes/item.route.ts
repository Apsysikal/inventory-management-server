import { Request, Response, Router } from "express";
import { createItem, getItem } from "../services/item.service";

// /item
const router = Router();

function parseSkipFromQuery(query: string | undefined): number {
  let skip = 0;

  if (!query) return skip;
  if (query === "0") return skip; // Edge case because Number("0") is falsy

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
  let skipNumber = 0;
  let limitNumber = 25;

  try {
    skipNumber = parseSkipFromQuery(skip as string);
  } catch (error) {
    return res
      .status(400)
      .contentType("application/json")
      .json("Bad input parameter")
      .end();
  }

  try {
    limitNumber = parseLimitFromQuery(limit as string);
  } catch (error) {
    return res
      .status(400)
      .contentType("application/json")
      .json("Bad input parameter")
      .end();
  }

  try {
    const item = await getItem(skipNumber, limitNumber);
    return res.status(200).contentType("application/json").json(item).end();
  } catch (error) {}

  return res.status(200).end();
});

router.post("/", async function (req: Request, res: Response) {
  const { serial, description, count } = req.body;
  const item = await createItem({ serial, description, count });
  res.status(201).contentType("application/json").json(item).end();
});

export default router;

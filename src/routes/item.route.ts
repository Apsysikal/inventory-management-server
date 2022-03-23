import { Request, Response, Router } from "express";
import {
  createItem,
  getItem,
  getItemById,
  modifyItem,
} from "../services/item.service";

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
  } catch (error) {
    return res
      .status(500)
      .contentType("application/json")
      .json("Internal server error")
      .end();
  }
});

router.post("/", async function (req: Request, res: Response) {
  const { serial, description, count } = req.body;

  try {
    const item = await createItem({ serial, description, count });
    return res.status(201).contentType("application/json").json(item).end();
  } catch (error) {
    if (String(error).match(/duplicate key/)) {
      return res
        .status(409)
        .contentType("application/json")
        .json("Item already exists")
        .end();
    }

    return res
      .status(400)
      .contentType("application/json")
      .json("Invalid item")
      .end();
  }
});

router.get("/:id", async function (req: Request, res: Response) {
  const { id } = req.params;

  try {
    const item = await getItemById(id);
    return res.status(200).type("application/json").json(item).end();
  } catch (error) {
    return res
      .status(404)
      .type("application/json")
      .json("Item not found")
      .end();
  }
});

router.put("/:id", async function (req: Request, res: Response) {
  const { id } = req.params;
  const item = req.body;

  try {
    const modifiedItem = await modifyItem(id, item);
    return res.status(200).type("application/json").json(modifiedItem).end();
  } catch (error) {
    return res
      .status(404)
      .type("application/json")
      .json("Item not found")
      .end();
  }
});

export default router;

import { Router } from "express";

import {
  createItem,
  getItem,
  getItemById,
  modifyItem,
} from "../controllers/item.controller";

// /items
const itemRouter = Router();

itemRouter.get("/", getItem);
itemRouter.post("/", createItem);
itemRouter.get("/:itemId", getItemById);
itemRouter.put("/:itemId", modifyItem);

export default itemRouter;

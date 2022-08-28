import { Router } from "express";

import {
  createItem,
  getItem,
  getItemById,
  modifyItem,
} from "../controllers/item.controller";
import { useAccessToken } from "../middlewares/useToken";
import { useUser } from "../middlewares/useUser";

// /items
const itemRouter = Router();

itemRouter.get("/", [useAccessToken, useUser, getItem]);
itemRouter.post("/", [useAccessToken, useUser, createItem]);
itemRouter.get("/:itemId", [useAccessToken, useUser, getItemById]);
itemRouter.put("/:itemId", [useAccessToken, useUser, modifyItem]);

export default itemRouter;

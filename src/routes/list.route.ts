import { Router } from "express";

import {
  createList,
  getList,
  getListById,
  modifyList,
} from "../controllers/list.controller";
import { useAccessToken } from "../middlewares/useToken";
import { useUser } from "../middlewares/useUser";

// /list
const listRouter = Router();

listRouter.get("/", [useAccessToken, useUser, getList]);
listRouter.post("/", [useAccessToken, useUser, createList]);
listRouter.get("/:listId", [useAccessToken, useUser, getListById]);
listRouter.put("/:listId", [useAccessToken, useUser, modifyList]);

export default listRouter;

import { RequestHandler } from "express";

import { TokenUser } from "src/models/user.model";
import { ItemService } from "../services/item.service";
import { ListService } from "../services/list.service";

import { createRequestQuery } from "../utils/query";

export const createItem: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const responseData = await ItemService.createItem(data);
    res.status(201).json(responseData);
  } catch (error) {
    next(error);
  }
};

export const getItem: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user as TokenUser; // Make sure middleware is included

    const requestOptions = createRequestQuery(req);
    if (!requestOptions.list) return next("List must be defined");

    const list = ListService.getListById(requestOptions.list, user.id);
    if (!list) return next("User has no access to this item");

    const responseData = await ItemService.getItem(requestOptions);
    res.json(responseData);
  } catch (error) {
    next(error);
  }
};

export const getItemById: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user as TokenUser; // Make sure middleware is included
    const { itemId } = req.params;

    const item = await ItemService.getItemById(itemId);
    if (!item) return res.json(item);

    const list = await ListService.getListById(String(item.list), user.id);
    if (!list) return next("User has no access to this item");

    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const modifyItem: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user as TokenUser; // Make sure middleware is included
    const { itemId } = req.params;
    const data = req.body;

    const item = await ItemService.getItemById(itemId);
    if (!item) return res.json(item);

    const list = await ListService.getListById(String(item.list), user.id);
    if (!list) return next("User has no access to this item");

    const updatedItem = ItemService.modifyItem(itemId, data);

    res.json(updatedItem);
  } catch (error) {
    next(error);
  }
};

import { RequestHandler } from "express";

import { ItemService } from "../services/item.service";

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
    const requestOptions = createRequestQuery(req);
    const responseData = await ItemService.getItem(requestOptions);
    res.json(responseData);
  } catch (error) {
    next(error);
  }
};

export const getItemById: RequestHandler = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const responseData = await ItemService.getItemById(itemId);
    res.json(responseData);
  } catch (error) {
    next(error);
  }
};

export const modifyItem: RequestHandler = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const data = req.body;
    const responseData = await ItemService.modifyItem(itemId, data);
    res.json(responseData);
  } catch (error) {
    next(error);
  }
};

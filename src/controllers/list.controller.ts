import { RequestHandler } from "express";

import { TokenUser } from "../models/user.model";
import { ListService } from "../services/list.service";

export const createList: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user as TokenUser; // Make sure middleware is included
    const data = req.body;
    data.owner = user.id; // Set the owner to the creator
    data.members = [user.id]; // Set the first member to the creator
    const responseData = await ListService.createList(data);
    res.status(201).json(responseData);
  } catch (error) {
    next(error);
  }
};

export const getList: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user as TokenUser; // Make sure middleware is included
    const responseData = await ListService.getList(user.id);
    res.json(responseData);
  } catch (error) {
    next(error);
  }
};

export const getListById: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user as TokenUser; // Make sure middleware is included
    const { listId } = req.params;
    if (!listId) return next("No list id");

    const responseData = await ListService.getListById(listId, user.id);
    // Check for user permission to access list
    return res.json(responseData);
  } catch (error) {
    next(error);
  }
};

export const modifyList: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user as TokenUser; // Make sure middleware is included
    const { listId } = req.params;
    const data = req.body;
    const responseData = await ListService.modifyList(listId, user.id, data);
    res.json(responseData);
  } catch (error) {
    next(error);
  }
};

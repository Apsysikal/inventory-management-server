/**
 * This is a slightly modified version taken from the krates repo.
 * https://github.com/sumitkolhe/krates/blob/main/src/utils/query.ts
 * This will probably be modified in some way in the future. But migrating
 * away from krates to a more custom backend should at first not break
 * the interface to the frontend. Thus using the same query evaluation
 * is probably not a bad idea?
 */

import { Request } from "express";

export interface QueryOptions {
  sort: string;
  list: string;
  limit: number;
  skip: number;
  query: Record<string, unknown>;
}

export const sanitizeQuery = (requestQuery: string): string => {
  const sanitizedQuery = Object();
  const queryObject = Object();

  requestQuery.split(",").forEach((i: string) => {
    const item = i.split(":")[0];
    const value = i.split(":")[1];
    queryObject[item] = value;
  });

  Object.keys(queryObject).forEach((key) => {
    const value = queryObject[key];

    if (
      value.startsWith(">=") ||
      value.startsWith("<=") ||
      value.startsWith(">") ||
      value.startsWith("<") ||
      value.startsWith("=")
    ) {
      // Querying a Number
      let val = 0;
      if (value.startsWith(">=") || value.startsWith("<="))
        val = value.substr(2);
      else val = value.substr(1);

      if (value.startsWith(">=")) sanitizedQuery[`${key}`] = { $gte: +val };
      else if (value.startsWith("<="))
        sanitizedQuery[`${key}`] = { $lte: +val };
      else if (value.startsWith(">")) sanitizedQuery[`${key}`] = { $gt: +val };
      else if (value.startsWith("<")) sanitizedQuery[`${key}`] = { $lt: +val };
      else if (value.startsWith("=")) sanitizedQuery[`${key}`] = +val;
    } else if (value.startsWith("*") || value.endsWith("*")) {
      // Need to do regex query
      let val = value;
      let regexp;

      if (value.startsWith("*")) val = value.substr(1);
      if (value.endsWith("*")) val = val.substr(0, val.length - 1);
      if (value.startsWith("*") && value.endsWith("*"))
        regexp = new RegExp(val, "i");
      else if (value.startsWith("*")) regexp = new RegExp(`${val}$`, "i");
      else if (value.endsWith("*")) regexp = new RegExp(`^${val}`, "i");

      sanitizedQuery[`${key}`] = regexp;
    } else if (value === true) sanitizedQuery[`${key}`] = true;
    else if (value === false) sanitizedQuery[`${key}`] = false;
    else sanitizedQuery[`${key}`] = new RegExp(`^${value}$`, "i");
  });

  return sanitizedQuery;
};

export const createRequestQuery = (req: Request): QueryOptions => {
  const requestOptions = Object();
  let queryOptions = Object();

  const { list, skip, limit, query } = req.query;

  if (query) queryOptions = sanitizeQuery(query as string);

  requestOptions.list = list || "";
  requestOptions.skip = Number(skip) || 0;
  requestOptions.limit = Number(limit) || 25;
  requestOptions.query = queryOptions;

  return requestOptions;
};

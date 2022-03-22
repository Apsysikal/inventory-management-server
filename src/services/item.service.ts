import ItemModel, { Item } from "../models/item.model";

export async function createItem(item: Item) {
  try {
    const newItem = new ItemModel(item);
    await newItem.save();
    return newItem;
  } catch (error) {
    throw error;
  }
}

export async function getItem(skip: number, limit: number) {
  try {
    const item = await ItemModel.find().skip(skip).limit(limit);
    return item;
  } catch (error) {
    throw error;
  }
}

export async function getItemById(id: string) {
  try {
    const item = await ItemModel.findById(id);
    return item;
  } catch (error) {
    throw error;
  }
}

export async function modifyItem(id: string, item: Item) {
  try {
    const updatedItem = await ItemModel.findById(id).update(item);
    return updatedItem;
  } catch (error) {
    throw error;
  }
}

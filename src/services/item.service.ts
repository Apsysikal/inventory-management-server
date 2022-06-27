import { Item, ItemModel } from "../models/item.model";
import { QueryOptions } from "../utils/query";

class ItemService {
  static async getItem(options: QueryOptions): Promise<Item[] | Item> {
    return await ItemModel.find(options.query)
      .skip(options.skip)
      .limit(options.limit);
  }

  static async getItemById(id: string): Promise<Item | null> {
    return await ItemModel.findById(id);
  }

  static async modifyItem(id: string, item: Item): Promise<Item> {
    const record = await ItemModel.findByIdAndUpdate(id, item, {
      new: true,
    });

    if (!record) {
      throw new Error("No record matching this id exists");
    }

    return record;
  }

  static async createItem(data: Item): Promise<Item> {
    return await new ItemModel(data).save();
  }
}

export { ItemService };

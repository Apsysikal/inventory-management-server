import { List, ListModel } from "../models/list.model";

class ListService {
  static async getList(userId: string): Promise<List[] | List> {
    return await ListModel.find({ owner: userId });
  }

  static async getListById(id: string): Promise<List | null> {
    return await ListModel.findById(id);
  }

  static async modifyList(id: string, list: List): Promise<List> {
    const record = await ListModel.findByIdAndUpdate(id, list, {
      new: true,
    });

    if (!record) {
      throw new Error("No record matching this id exists");
    }

    return record;
  }

  static async createList(data: List): Promise<List> {
    return await new ListModel(data).save();
  }
}

export { ListService };

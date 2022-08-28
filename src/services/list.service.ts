import { List, ListModel } from "../models/list.model";

class ListService {
  static async getList(userId: string): Promise<List[] | List> {
    // Only find lists where the user is also a member of
    return await ListModel.find({ members: { $in: userId } }).populate({
      path: "owner members",
      select: "_id displayName",
    });
  }

  static async getListById(id: string, userId: string): Promise<List | null> {
    // Only find lists where the user is also a member of
    return await ListModel.findOne({
      _id: id,
      members: { $in: userId },
    }).populate({
      path: "owner members",
      select: "_id displayName",
    });
  }

  static async modifyList(
    id: string,
    userId: string,
    list: List
  ): Promise<List> {
    // Only find lists where the user is also a member of
    const record = await ListModel.findOneAndUpdate(
      {
        _id: id,
        members: { $in: userId },
      },
      list,
      {
        new: true,
      }
    ).populate({
      path: "owner members",
      select: "_id displayName",
    });

    if (!record) {
      throw new Error("No record matching this id exists");
    }

    return record;
  }

  static async createList(data: List): Promise<List> {
    return await (
      await new ListModel(data).save()
    ).populate({
      path: "owner members",
      select: "_id displayName",
    });
  }
}

export { ListService };

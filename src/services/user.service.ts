import { User, UserModel } from "../models/user.model";

class UserService {
  static async getUserById(id: string): Promise<User | null> {
    return await UserModel.findById(id);
  }

  static async getUserByProviderAndId(
    provider: string,
    providerId: string
  ): Promise<User | null> {
    return await UserModel.findOne({
      provider,
      providerId,
    });
  }

  static async modifyUser(id: string, user: User): Promise<User> {
    const record = await UserModel.findByIdAndUpdate(id, user, { new: true });

    if (!record) {
      throw new Error("No record matching this id exists");
    }

    return record;
  }

  static async createUser(data: User): Promise<User> {
    return await new UserModel(data).save();
  }
}

export { UserService };

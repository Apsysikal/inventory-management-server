import { model, Schema } from "mongoose";

interface List {
  title: string;
  description: string;
  owner: Schema.Types.ObjectId;
  members: Schema.Types.ObjectId[];
}

const schema = new Schema<List>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ListModel = model<List>("List", schema);

export { List, ListModel };

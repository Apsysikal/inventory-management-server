import { model, Schema } from "mongoose";

interface Item {
  serial: string;
  description: string;
  count: number;
  list: Schema.Types.ObjectId;
}

const schema = new Schema<Item>(
  {
    serial: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    list: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ItemModel = model<Item>("Item", schema);

export { Item, ItemModel };

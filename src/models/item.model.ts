import { model, Schema } from "mongoose";

interface Item {
  serial: string;
  description: string;
  count: number;
}

const schema = new Schema<Item>(
  {
    serial: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ItemModel = model<Item>("Item", schema);

export { Item, ItemModel };

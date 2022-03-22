import { model, Schema, Model, Document } from "mongoose";

export interface Item {
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

export default ItemModel;

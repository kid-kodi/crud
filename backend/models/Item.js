const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

itemSchema.methods.toJSON = function () {
  const item = this;
  const itemObject = item.toObject();
  delete itemObject.__v;

  return itemObject;
};

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;

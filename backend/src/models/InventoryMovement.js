const mongoose = require("mongoose");

const inventoryMovementSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    movementType: {
      type: String,
      enum: ["STOCK_IN", "SALE", "RETURN", "ADJUSTMENT"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    previousStock: {
      type: Number,
      required: true,
      min: 0,
    },

    newStock: {
      type: Number,
      required: true,
      min: 0,
    },

    reason: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

inventoryMovementSchema.index({
  organization: 1,
  product: 1,
  createdAt: -1,
});

inventoryMovementSchema.index({
  organization: 1,
  movementType: 1,
  createdAt: -1,
});

inventoryMovementSchema.index({
  organization: 1,
  performedBy: 1,
  createdAt: -1,
});

const InventoryMovement = mongoose.model(
  "InventoryMovement",
  inventoryMovementSchema,
);

module.exports = InventoryMovement;

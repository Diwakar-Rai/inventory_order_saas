const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    contactPerson: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 150,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 30,
    },

    address: {
      line1: {
        type: String,
        trim: true,
        maxlength: 200,
      },

      line2: {
        type: String,
        trim: true,
        maxlength: 200,
      },

      city: {
        type: String,
        trim: true,
        maxlength: 100,
      },

      state: {
        type: String,
        trim: true,
        maxlength: 100,
      },

      postalCode: {
        type: String,
        trim: true,
        maxlength: 20,
      },

      country: {
        type: String,
        trim: true,
        maxlength: 100,
      },
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "ARCHIVED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  },
);

supplierSchema.index({
  organization: 1,
  status: 1,
});

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;

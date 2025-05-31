const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  billNo: {
    type: Number,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerAddress: {
    type: String,
  },
  customerPhone: {
    type: String,
  },
  customerArea: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "closed"],
  },
  week: [
    {
      weekNo: {
        type: Number,
        default: 1,
      },
      invoices: [
        {
          invoiceNo: String,
          invoiceAmount: Number,
          invoiceDate: Date,
        },
      ],
      totalAmount: {
        type: Number,
      },
      remainingAmount: {
        type: Number,
      },
      receivedAmount: {
        type: Number,
        default: 0,
      },
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
});

module.exports = mongoose.model("Bill", billSchema);

const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceNo: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  billNo: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Invoice", invoiceSchema);

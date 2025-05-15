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
  bill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bill",
    required: true,
  },
});

module.exports = mongoose.model("Invoice", invoiceSchema);

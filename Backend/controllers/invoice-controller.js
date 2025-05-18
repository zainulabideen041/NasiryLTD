const Invoice = require("../models/Invoice");
const Bill = require("../models/Bill");

const AddInvoice = async (req, res) => {
  try {
    const { invoiceNo, date, amount, billNo } = req.body;

    if (!invoiceNo || !date || !amount || !billNo) {
      return res.json("All Fields are Required!");
    }

    const bill = await Bill.findOne({ billNo });

    if (!bill) {
      return res.json("Bill doesn't exist.");
    }

    const existingInvoice = await Invoice.findOne({ invoiceNo });

    if (existingInvoice) {
      return res.json("Invoice with this Invoice No. already exists. ");
    }

    const invoice = new Invoice({
      invoiceNo,
      date,
      amount,
      billNo,
    });

    await invoice.save();

    bill.invoices.push(invoice.invoiceNo);
    await bill.save();

    res.json({
      success: true,
      message: "Invoice Added Successfully",
      invoice: invoice,
    });
  } catch (error) {
    console.error("Error Adding Invoice:", error);
    res.status(500).json({
      success: false,
      message: "Failed to Add Invoice.",
      error: error,
    });
  }
};

const DeleteInvoice = async (req, res) => {
  try {
    const { invoiceNo } = req.params;

    const invoice = await Invoice.findOne({ invoiceNo });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice doesn't exist.",
      });
    }

    // Remove invoice reference from the Bill as well
    await Bill.updateOne(
      { billNo: invoice.bill },
      { $pull: { invoices: invoice.invoiceNo } }
    );

    await invoice.deleteOne();

    res.json({
      success: true,
      message: "Invoice Deleted Successfully",
    });
  } catch (error) {
    console.error("Error Deleting Invoice:", error);
    res.status(500).json({
      success: false,
      message: "Failed to Delete Invoice.",
      error: error.message,
    });
  }
};

module.exports = { AddInvoice, DeleteInvoice };

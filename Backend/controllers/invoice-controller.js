const Invoice = require("../models/Invoice");
const Bill = require("../models/Bill");

const AddInvoice = async (req, res) => {
  try {
    const { invoiceNo, date, amount, billNo } = req.body;

    if (!invoiceNo || !date || !amount || !billNo) {
      return res.json("All Fields are Required!");
    }

    const Invoice_amount = Number(amount);

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
      amount: Invoice_amount,
      billNo,
    });

    await invoice.save();

    bill.remainingAmount -= Invoice_amount;
    bill.receivedAmount += Invoice_amount;
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

const UpdateInvoice = async (req, res) => {
  try {
    const { invoiceNo, date, amount } = req.body;

    if (!invoiceNo) {
      return res.status(400).json({
        success: false,
        message: "invoiceNo is required to update the invoice.",
      });
    }

    const invoice = await Invoice.findOne({ invoiceNo });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found.",
      });
    }

    if (date !== undefined) invoice.date = date;

    if (amount !== undefined) {
      const numericAmount = Number(amount);
      if (isNaN(numericAmount)) {
        return res.status(400).json({
          success: false,
          message: "Amount must be a valid number.",
        });
      }
      invoice.amount = numericAmount;
    }

    await invoice.save();

    const bill = await Bill.findOne({ billNo: invoice.billNo });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill does not exist.",
      });
    }

    const invoices = await Invoice.find({ billNo: bill.billNo });

    const totalReceived = invoices.reduce(
      (sum, inv) => sum + Number(inv.amount || 0),
      0
    );

    bill.receivedAmount = totalReceived;
    bill.remainingAmount = bill.totalAmount - totalReceived;

    await bill.save();

    res.json({
      success: true,
      message: "Invoice updated successfully.",
      invoice,
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update invoice.",
      error: error.message,
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
      { billNo: invoice.billNo },
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

module.exports = { AddInvoice, UpdateInvoice, DeleteInvoice };

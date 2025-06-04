const Invoice = require("../models/Invoice");
const Bill = require("../models/Bill");

const AddInvoice = async (req, res) => {
  try {
    const { invoiceNo, date, amount, billNo, weekNo } = req.body;

    if (!invoiceNo || !date || !amount || !billNo || !weekNo) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const Invoice_amount = Number(amount);

    const bill = await Bill.findOne({ billNo });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill doesn't exist.",
      });
    }

    const existingInvoice = await Invoice.findOne({ invoiceNo });

    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        message: "Invoice with this Invoice No. already exists.",
      });
    }

    const invoice = new Invoice({
      invoiceNo,
      date,
      amount: Invoice_amount,
      billNo,
    });

    await invoice.save();

    const targetWeek = bill.week.find((w) => w.weekNo === Number(weekNo));

    if (!targetWeek) {
      return res.status(400).json({
        success: false,
        message: `Week ${weekNo} not found in this bill.`,
      });
    }

    // Get unique dates from existing invoices in this week
    const existingDates = new Set();
    targetWeek.invoices.forEach((invoice) => {
      // Convert date to string for comparison (assuming date format is consistent)
      const dateStr = new Date(invoice.invoiceDate).toDateString();
      existingDates.add(dateStr);
    });

    // Check if the new invoice date already exists
    const newDateStr = new Date(date).toDateString();
    const isNewDate = !existingDates.has(newDateStr);

    // If it's a new date and we already have 5 different dates, reject
    if (isNewDate && existingDates.size >= 5) {
      return res.status(400).json({
        success: false,
        message: `Week ${weekNo} already has invoices from 5 different dates. Cannot add invoice with a new date.`,
      });
    }

    // Add the invoice reference
    targetWeek.invoices.push({
      invoiceNo,
      invoiceDate: date,
      invoiceAmount: Invoice_amount,
    });

    // Ensure totalAmount is initialized
    targetWeek.totalAmount = (targetWeek.totalAmount || 0) + Invoice_amount;

    await bill.save();

    res.json({
      success: true,
      message: "Invoice added successfully.",
      invoice,
    });
  } catch (error) {
    console.error("Error Adding Invoice:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add invoice.",
      error: error.message,
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

    const oldAmount = invoice.amount;

    if (date !== undefined) {
      invoice.date = date;
    }

    let newAmount = oldAmount;

    if (amount !== undefined) {
      const numericAmount = Number(amount);
      if (isNaN(numericAmount)) {
        return res.status(400).json({
          success: false,
          message: "Amount must be a valid number.",
        });
      }
      newAmount = numericAmount;
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

    const week = bill.week.find((w) => w.invoices.includes(invoiceNo));

    if (!week) {
      return res.status(400).json({
        success: false,
        message: "Invoice does not belong to any week in the bill.",
      });
    }

    // Update totalAmount for the week
    week.totalAmount = (week.totalAmount || 0) - oldAmount + newAmount;

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

    const bill = await Bill.findOne({ billNo: invoice.billNo });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Associated bill not found.",
      });
    }

    // Find the week that contains this invoice
    const targetWeek = bill.week.find((w) =>
      w.invoices.some((inv) => inv.invoiceNo === invoiceNo)
    );

    if (!targetWeek) {
      return res.status(400).json({
        success: false,
        message: "Invoice not found in any week of the bill.",
      });
    }

    // Remove the invoice object from the week
    targetWeek.invoices = targetWeek.invoices.filter(
      (inv) => inv.invoiceNo !== invoiceNo
    );

    // Subtract the invoice amount from totalAmount
    targetWeek.totalAmount =
      (targetWeek.totalAmount || 0) - Number(invoice.amount || 0);

    // Recalculate remainingAmount
    targetWeek.remainingAmount =
      (targetWeek.totalAmount || 0) - (targetWeek.receivedAmount || 0);

    // Save updated bill
    await bill.save();

    // Delete the invoice from the Invoice collection
    await invoice.deleteOne();

    res.json({
      success: true,
      message: "Invoice deleted successfully.",
    });
  } catch (error) {
    console.error("Error Deleting Invoice:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete invoice.",
      error: error.message,
    });
  }
};

module.exports = { AddInvoice, UpdateInvoice, DeleteInvoice };

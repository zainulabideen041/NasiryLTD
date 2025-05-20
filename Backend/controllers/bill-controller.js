const Bill = require("../models/Bill");
const Invoice = require("../models/Invoice");

const CreateBill = async (req, res) => {
  try {
    const { customerName, customerAddress, customerPhone, createdDate } =
      req.body;

    if (!customerName || !customerAddress) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    const latestBill = await Bill.findOne().sort({ billNo: -1 }).limit(1);

    const newBillNo = latestBill ? Number(latestBill.billNo) + 1 : 1;

    const bill = new Bill({
      billNo: newBillNo.toString(),
      customerName,
      customerAddress,
      customerPhone,
      createdDate,
    });

    await bill.save();

    res.json({
      success: true,
      message: "Bill Created Successfully",
      bill,
    });
  } catch (error) {
    console.error("Error creating bill:", error);
    res.status(500).error({
      success: false,
      message: "Failed to create bill.",
      error: error,
    });
  }
};

const DisplayBill = async (req, res) => {
  try {
    const { billNo } = req.params;

    const bill = await Bill.findOne({ billNo });

    if (!bill) {
      return res.json("No Bill Found!");
    }

    // Fetch full invoice details using invoiceNo from the bill
    const fullInvoices = await Invoice.find({
      invoiceNo: { $in: bill.invoices },
    });

    // Return bill details along with invoice details
    res.json({
      success: true,
      bill: {
        ...bill.toObject(),
        invoices: fullInvoices,
      },
    });
  } catch (error) {
    console.error("Error Displaying bill:", error);
    res.status(500).json({
      success: false,
      message: "Failed to Display bill.",
      error: error,
    });
  }
};

const DisplayBills = async (req, res) => {
  try {
    const bills = await Bill.find();

    if (!bills || bills.length === 0) {
      return res.json("No Bills Found!");
    }

    // Collect all invoice numbers from all bills
    const allInvoiceNos = bills.flatMap((bill) => bill.invoices);

    // Fetch all invoice details
    const invoices = await Invoice.find({ invoiceNo: { $in: allInvoiceNos } });

    // Map invoiceNo to invoice object for quick lookup
    const invoiceMap = {};
    invoices.forEach((inv) => {
      invoiceMap[inv.invoiceNo] = inv;
    });

    // Attach full invoice details to each bill
    const enrichedBills = bills.map((bill) => {
      const fullInvoices = bill.invoices
        .map((invNo) => invoiceMap[invNo])
        .filter(Boolean);
      return {
        ...bill.toObject(),
        invoices: fullInvoices,
      };
    });

    res.json({
      success: true,
      bills: enrichedBills,
    });
  } catch (error) {
    console.error("Error displaying bills:", error);
    res.status(500).json({
      success: false,
      message: "Failed to display bills.",
      error,
    });
  }
};

const UpdateBill = async (req, res) => {
  try {
    const { billNo } = req.params;
    const { customerName, customerAddress, customerPhone, finalDate, status } =
      req.body;

    const bill = await Bill.findOne({ billNo });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found.",
      });
    }

    // Update fields if they are provided in request body
    if (customerName) bill.customerName = customerName;
    if (customerAddress) bill.customerAddress = customerAddress;
    if (customerPhone) bill.customerPhone = customerPhone;
    if (finalDate) bill.finalDate = finalDate;
    if (status) bill.status = status;

    await bill.save();

    res.json({
      success: true,
      message: "Bill updated successfully.",
      bill,
    });
  } catch (error) {
    console.error("Error updating bill:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update bill.",
      error: error.message,
    });
  }
};

module.exports = { CreateBill, DisplayBill, DisplayBills, UpdateBill };

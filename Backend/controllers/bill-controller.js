const Bill = require("../models/Bill");
const Invoice = require("../models/Invoice");
const Admin = require("../models/Admin");

const CreateBill = async (req, res) => {
  try {
    const { userid } = req.params;
    const { customerName, customerAddress, customerPhone, customerArea } =
      req.body;

    if (!customerName || !customerAddress || !customerPhone || !customerArea) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    const user = await Admin.findById(userid);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    const latestBill = await Bill.findOne().sort({ billNo: -1 }).limit(1);

    const newBillNo = latestBill ? Number(latestBill.billNo) + 1 : 1;

    const bill = new Bill({
      billNo: newBillNo.toString(),
      customerName,
      customerAddress,
      customerPhone,
      customerArea,
      week: [
        {
          weekNo: 1,
          totalAmount: 0,
          receivedAmount: 0,
          remainingAmount: 0,
          invoices: [],
        },
      ],
      userId: userid,
    });

    await bill.save();

    res.json({
      success: true,
      message: "Bill Created Successfully",
      bill,
    });
  } catch (error) {
    console.error("Error creating bill:", error);
    if (
      error.name === "MongooseError" &&
      error.message.includes("buffering timed out")
    ) {
      return res.status(503).json({
        message: "Database connection timeout. Please try again shortly.",
        error: "CONNECTION_TIMEOUT",
      });
    }
    res.status(500).json({
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

    // Extract all invoiceNos from all weeks
    const allInvoiceNos = bill.week
      .flatMap((w) => w.invoices)
      .map((inv) => inv.invoiceNo)
      .filter(Boolean); // remove undefined/null if any

    // Fetch full invoice details using invoiceNo from the bill
    const fullInvoices = await Invoice.find({
      invoiceNo: { $in: allInvoiceNos },
    });

    // Return bill details along with invoice details
    res.json({
      success: true,
      bill: {
        ...bill.toObject(),
      },
    });
  } catch (error) {
    console.error("Error Displaying bill:", error);
    if (
      error.name === "MongooseError" &&
      error.message.includes("buffering timed out")
    ) {
      return res.status(503).json({
        message: "Database connection timeout. Please try again shortly.",
        error: "CONNECTION_TIMEOUT",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to Display bill.",
      error: error,
    });
  }
};

const AddWeek = async (req, res) => {
  try {
    const { billNo } = req.body;

    if (!billNo) {
      return res.status(400).json({
        success: false,
        message: "Bill number is required.",
      });
    }

    const bill = await Bill.findOne({ billNo });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found.",
      });
    }

    // Get current maximum week number
    const lastWeek = bill.week[bill.week.length - 1];
    const nextWeekNo = lastWeek ? lastWeek.weekNo + 1 : 1;

    // Calculate and collect remaining amounts from previous weeks
    let totalRemaining = 0;
    bill.week.forEach((week) => {
      if (week.remainingAmount > 0) {
        totalRemaining += week.remainingAmount;
        week.remainingAmount = 0; // Reset previous week's remaining amount
      }
    });

    // Add new week with accumulated remaining amount
    bill.week.push({
      weekNo: nextWeekNo,
      totalAmount: 0,
      receivedAmount: 0,
      remainingAmount: totalRemaining,
      invoices: [],
    });

    await bill.save();

    res.json({
      success: true,
      message: `Week ${nextWeekNo} added successfully.`,
      bill,
    });
  } catch (error) {
    console.error("Error adding week:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add new week.",
      error: error.message,
    });
  }
};

const DisplayBills = async (req, res) => {
  try {
    const { userid } = req.params;

    const bills = await Bill.find({ userId: userid });

    if (!bills || bills.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bills found for this user.",
      });
    }

    // Collect all invoice numbers from all weeks in all bills
    const allInvoiceNos = bills.flatMap((bill) =>
      bill.week.flatMap((w) => w.invoices)
    );

    // Fetch full invoice details
    const invoices = await Invoice.find({
      invoiceNo: { $in: allInvoiceNos },
    });

    // Create a lookup map for quick access
    const invoiceMap = {};
    invoices.forEach((inv) => {
      invoiceMap[inv.invoiceNo] = inv;
    });

    // Replace each invoiceNo in each week's invoices array with full invoice object
    const enrichedBills = bills.map((bill) => {
      const billObj = bill.toObject();
      billObj.week = billObj.week.map((w) => {
        const fullInvoices = w.invoices
          .map((invNo) => invoiceMap[invNo])
          .filter(Boolean); // Remove any missing invoices
        return {
          ...w,
          invoices: fullInvoices,
        };
      });
      return billObj;
    });

    res.json({
      success: true,
      bills: enrichedBills,
    });
  } catch (error) {
    console.error("Error displaying bills:", error);
    if (
      error.name === "MongooseError" &&
      error.message.includes("buffering timed out")
    ) {
      return res.status(503).json({
        message: "Database connection timeout. Please try again shortly.",
        error: "CONNECTION_TIMEOUT",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to display bills.",
      error: error.message,
    });
  }
};

const UpdateBill = async (req, res) => {
  try {
    const { billNo } = req.params;
    const {
      customerName,
      customerAddress,
      customerPhone,
      customerArea,
      status,
      weekNo,
      receivedAmount,
    } = req.body;

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
    if (customerArea) bill.customerArea = customerArea;
    if (status) bill.status = status;

    if (receivedAmount && weekNo) {
      const targetWeek = bill.week.find((w) => w.weekNo === Number(weekNo));
      if (targetWeek) {
        targetWeek.receivedAmount = receivedAmount;
        targetWeek.remainingAmount =
          (targetWeek.totalAmount || 0) - receivedAmount;
      }
    }

    await bill.save();

    res.json({
      success: true,
      message: "Bill updated successfully.",
      bill,
    });
  } catch (error) {
    console.error("Error updating bill:", error);
    if (
      error.name === "MongooseError" &&
      error.message.includes("buffering timed out")
    ) {
      return res.status(503).json({
        message: "Database connection timeout. Please try again shortly.",
        error: "CONNECTION_TIMEOUT",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update bill.",
      error: error.message,
    });
  }
};

const CloseBill = async (req, res) => {
  try {
    const { billNo } = req.params;

    const bill = await Bill.findOne({ billNo });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found.",
      });
    }

    if (bill.status === "closed") {
      return res.status(404).json({
        success: false,
        message: "Bill is already closed.",
      });
    }

    bill.status = "closed";

    await bill.save();

    res.json({
      success: true,
      message: "Bill Closed Successfully.",
      bill,
    });
  } catch (error) {
    console.error("Error updating bill:", error);
    if (
      error.name === "MongooseError" &&
      error.message.includes("buffering timed out")
    ) {
      return res.status(503).json({
        message: "Database connection timeout. Please try again shortly.",
        error: "CONNECTION_TIMEOUT",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update bill.",
      error: error.message,
    });
  }
};

const DeleteBill = async (req, res) => {
  try {
    const { billNo } = req.params;

    const bill = await Bill.findOne({ billNo });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found.",
      });
    }

    // Ensure there is at least one week
    if (!bill.week || bill.week.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Bill has no weeks defined. Cannot proceed.",
      });
    }

    // Check if first week has any invoices
    const firstWeek = bill.week.find((w) => w.weekNo === 1);

    if (!firstWeek || (firstWeek.invoices && firstWeek.invoices.length > 0)) {
      return res.status(400).json({
        success: false,
        message: "Bill cannot be deleted because the first week has invoices.",
      });
    }

    // Delete the bill
    await Bill.deleteOne({ billNo });

    res.json({
      success: true,
      message: "Bill deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting bill:", error);
    if (
      error.name === "MongooseError" &&
      error.message.includes("buffering timed out")
    ) {
      return res.status(503).json({
        message: "Database connection timeout. Please try again shortly.",
        error: "CONNECTION_TIMEOUT",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to delete bill.",
      error: error.message,
    });
  }
};

// const deleteAll = async (req, res) => {
//   await Bill.deleteAll();
// };

module.exports = {
  CreateBill,
  DisplayBill,
  AddWeek,
  DisplayBills,
  UpdateBill,
  DeleteBill,
  CloseBill,
};

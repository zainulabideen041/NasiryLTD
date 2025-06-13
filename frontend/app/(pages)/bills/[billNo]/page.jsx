"use client";
import { useEffect, useState } from "react";
import { use } from "react";
import Swal from "sweetalert2";
import { notFound, useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { useDispatch } from "react-redux";
import EditInvoice from "./editInvoice";
import AddInvoice from "./addInvoice";
import EditBill from "./editBill";
import {
  getBillByNo,
  deleteBill,
  updateBill,
  addWeek,
} from "@/redux/bill-slice";
import {
  addInvoice,
  deleteInvoice,
  updateInvoice,
} from "@/redux/invoice-slice";
import { Button } from "@/components/ui/button";

const BillDetails = ({ params }) => {
  const { billNo } = use(params);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const [bill, setBill] = useState({});
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    const getBillDetails = async () => {
      const resultAction = await dispatch(getBillByNo(billNo));
      if (getBillByNo.fulfilled.match(resultAction)) {
        const billData = resultAction.payload;
        setWeeks(billData.week || []);
        setBill(billData);
        setLoading(false);
      } else {
        console.error("Failed to fetch bill:", resultAction.error);
      }
    };
    getBillDetails();
  }, [billNo, dispatch]);

  if (!bill) return notFound();

  // Helper functions for week-specific checks
  const getWeekInvoiceCount = (week) => {
    return week.invoices ? week.invoices.length : 0;
  };

  const hasWeekFiveInvoices = (week) => {
    return getWeekInvoiceCount(week) === 5;
  };

  const hasWeekAnyInvoices = (week) => {
    return getWeekInvoiceCount(week) > 0;
  };

  // NEW: Check if week has 5 different dates
  const getWeekUniqueDatesCount = (week) => {
    if (!week.invoices || week.invoices.length === 0) return 0;

    const uniqueDates = new Set();
    week.invoices.forEach((invoice) => {
      const dateStr = new Date(invoice.invoiceDate).toDateString();
      uniqueDates.add(dateStr);
    });

    return uniqueDates.size;
  };

  const hasWeekFiveDifferentDates = (week) => {
    return getWeekUniqueDatesCount(week) >= 5;
  };

  // Updated: Can add invoices if less than 5 different dates (not just 5 invoices)
  const canWeekAddInvoices = (week) => {
    return !hasWeekFiveDifferentDates(week);
  };

  // Check if we can add a new week (last week should have exactly 5 invoices)
  const canAddNewWeek = () => {
    if (weeks.length === 0) return false;
    const lastWeek = weeks[weeks.length - 1];
    return hasWeekFiveDifferentDates(lastWeek);
  };

  // NEW: Check if bill has any invoices in any week
  const billHasAnyInvoices = () => {
    return weeks.some((week) => hasWeekAnyInvoices(week));
  };

  const [editInvoice, setEditInvoice] = useState(null);
  const [showAddPopover, setShowAddPopover] = useState(false);
  const [showEditPopover, setShowEditPopover] = useState(false);
  const [formData, setFormData] = useState({
    billNo: billNo,
    invoiceNo: "",
    date: "",
    amount: "",
    weekNo: "",
  });
  const [billForm, setBillForm] = useState({
    billNo: billNo,
    customerName: "",
    customerAddress: "",
    customerArea: "",
    customerPhone: "",
    receivedAmount: "",
    weekNo: "",
  });

  const resetForm = (weekNo = "") => {
    setFormData({
      billNo: billNo,
      invoiceNo: "",
      date: "",
      amount: "",
      weekNo,
    });
    setBillForm({
      billNo: billNo,
      customerName: bill.customerName || "",
      customerAddress: bill.customerAddress || "",
      customerArea: bill.customerArea || "",
      customerPhone: bill.customerPhone || "",
      receivedAmount: bill.receivedAmount || "",
      weekNo,
    });
  };

  const handleRowClick = (invoice, weekNo) => {
    setEditInvoice(invoice.invoiceNo);
    setFormData({
      billNo: billNo,
      invoiceNo: invoice.invoiceNo,
      date: invoice.date ? invoice.date.split("T")[0] : "",
      amount: invoice.amount,
      weekNo: weekNo,
    });
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBillChange = (field, value) => {
    setBillForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const refreshBillData = async () => {
    const refreshedBill = await dispatch(getBillByNo(billNo));
    if (getBillByNo.fulfilled.match(refreshedBill)) {
      const billData = refreshedBill.payload;
      setBill(billData);
      setWeeks(billData.week || []);
      return true;
    }
    return false;
  };

  const handleAdd = async () => {
    if (!formData.invoiceNo || !formData.date || !formData.amount) {
      Swal.fire("Validation Error", "All fields are required.", "warning");
      return;
    }
    setLoading(true);
    try {
      const resultAction = await dispatch(addInvoice(formData));
      if (!addInvoice.fulfilled.match(resultAction)) {
        const errorMessage =
          resultAction.payload?.message ||
          resultAction.error?.message ||
          "Failed to add invoice.";
        throw new Error(errorMessage);
      }

      await refreshBillData();
      resetForm();
      setShowAddPopover(false);

      Swal.fire("Success", "Invoice added successfully!", "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const resultAction = await dispatch(updateInvoice(formData));
      if (!updateInvoice.fulfilled.match(resultAction)) {
        const errorMessage =
          resultAction.payload?.message ||
          resultAction.error?.message ||
          "Failed to update invoice.";
        throw new Error(errorMessage);
      }
      await refreshBillData();
      setEditInvoice(null);
      Swal.fire("Success", "Invoice updated successfully!", "success");
    } catch (error) {
      Swal.fire(
        "Error",
        error.message || "Something went wrong while updating invoice.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const invoiceDelete = async () => {
    setLoading(true);
    try {
      const resultAction = await dispatch(deleteInvoice(formData.invoiceNo));
      if (!deleteInvoice.fulfilled.match(resultAction)) {
        const errorMessage =
          resultAction.payload?.message ||
          resultAction.error?.message ||
          "Failed to delete invoice.";
        throw new Error(errorMessage);
      }
      await refreshBillData();
      setEditInvoice(null);
      Swal.fire("Success", "Invoice deleted successfully!", "success");
    } catch (error) {
      Swal.fire(
        "Error",
        error.message || "Something went wrong while deleting invoice.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const billDelete = async () => {
    setLoading(true);
    try {
      await dispatch(deleteBill(billNo));
      Swal.fire("Success", "Bill deleted successfully!", "success");
      router.push("/bills");
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to delete bill.", "error");
    } finally {
      setLoading(false);
    }
  };

  const billUpdate = async () => {
    setLoading(true);
    try {
      const resultAction = await dispatch(updateBill({ billNo, billForm }));
      if (!updateBill.fulfilled.match(resultAction)) {
        const errorMessage =
          resultAction.payload?.message ||
          resultAction.error?.message ||
          "Failed to update bill.";
        throw new Error(errorMessage);
      }
      await refreshBillData();
      setShowEditPopover(false);
      Swal.fire("Success", "Bill updated successfully!", "success");
    } catch (error) {
      Swal.fire(
        "Error",
        error.message || "Something went wrong while updating Bill.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const NewWeek = async () => {
    setLoading(true);
    try {
      const resultAction = await dispatch(addWeek(billNo));
      if (!addWeek.fulfilled.match(resultAction)) {
        const errorMessage =
          resultAction.payload?.message ||
          resultAction.error?.message ||
          "Failed to add new week.";
        throw new Error(errorMessage);
      }
      await refreshBillData();
      Swal.fire("Success", "New week added successfully!", "success");
    } catch (error) {
      Swal.fire(
        "Error",
        error.message || "Something went wrong while adding new week.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="relative w-full p-2 md:p-4">
      <div className="mb-6 flex flex-wrap gap-3">
        {canAddNewWeek() && (
          <Button
            onClick={NewWeek}
            className="hover:cursor-pointer bg-[var(--ring)] text-white text-xl"
          >
            Add New Week
          </Button>
        )}
        {/* UPDATED: Only show delete button if bill has NO invoices */}
        {!billHasAnyInvoices() && (
          <Button
            onClick={billDelete}
            variant="destructive"
            className="hover:cursor-pointer text-xl"
          >
            Delete Bill
          </Button>
        )}
      </div>

      {/* Week sections */}
      {weeks.map((currentWeek, index) => (
        <div
          key={currentWeek.weekNo || index}
          className={`${
            index > 0 ? "mt-8 pt-6 border-t-2 border-gray-200" : ""
          }`}
        >
          <div className="mb-4">
            <h1 className="text-2xl lg:text-4xl lg:font-extrabold font-bold tracking-wide mb-2">
              {bill.customerName} -{" "}
              {(() => {
                const invoices = currentWeek?.invoices || [];
                if (invoices.length === 0)
                  return `Week ${currentWeek?.weekNo || index + 1}`;

                const dates = invoices
                  .map((inv) => new Date(inv.invoiceDate))
                  .sort((a, b) => a - b);

                const format = (date) => date.toLocaleDateString("en-CA"); // yyyy-mm-dd

                const uniqueDateStrings = [
                  ...new Set(dates.map((d) => d.toDateString())),
                ];

                if (uniqueDateStrings.length >= 5) {
                  return `${format(dates[0])} to ${format(
                    dates[dates.length - 1]
                  )}`;
                }

                return format(dates[0]);
              })()}
            </h1>

            <div className="text-sm text-gray-600 mb-4">
              Invoices: {getWeekInvoiceCount(currentWeek)}/5 (Unique dates:{" "}
              {getWeekUniqueDatesCount(currentWeek)}/5)
              {hasWeekFiveDifferentDates(currentWeek) && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  5 Different Dates Complete
                </span>
              )}
            </div>
          </div>

          {/* UPDATED: Add Invoice Component - Only show if week doesn't have 5 different dates and bill is active */}
          {canWeekAddInvoices(currentWeek) && (
            <AddInvoice
              weekNo={currentWeek.weekNo}
              formData={formData}
              handleChange={handleChange}
              handleAdd={handleAdd}
              resetForm={resetForm}
              showAddPopover={showAddPopover}
              setShowAddPopover={setShowAddPopover}
              fiveInvoices={hasWeekFiveDifferentDates(currentWeek)}
              invoiceLength={hasWeekAnyInvoices(currentWeek)}
              bill={bill}
            />
          )}

          {/* Edit Invoice Component */}
          <EditInvoice
            resetForm={resetForm}
            editInvoice={editInvoice}
            setEditInvoice={setEditInvoice}
            formData={formData}
            handleChange={handleChange}
            handleUpdate={handleUpdate}
            invoiceDelete={invoiceDelete}
            fiveInvoices={hasWeekFiveInvoices(currentWeek)}
            invoiceLength={hasWeekAnyInvoices(currentWeek)}
            handleRowClick={handleRowClick}
            bill={bill}
            week={currentWeek}
          />

          {/* UPDATED: Edit Bill Component - Show for last week if it has invoices (removed remaining amount condition) */}
          {index === weeks.length - 1 && hasWeekAnyInvoices(currentWeek) && (
            <EditBill
              week={currentWeek}
              billNo={billNo}
              billForm={billForm}
              oneInvoice={hasWeekAnyInvoices(currentWeek)}
              showEditPopover={showEditPopover}
              setShowEditPopover={setShowEditPopover}
              handleChange={handleBillChange}
              billUpdate={billUpdate}
              resetForm={resetForm}
            />
          )}
        </div>
      ))}

      {/* Show message if no weeks exist */}
      {weeks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600">No weeks found for this bill.</p>
        </div>
      )}
    </div>
  );
};

export default BillDetails;

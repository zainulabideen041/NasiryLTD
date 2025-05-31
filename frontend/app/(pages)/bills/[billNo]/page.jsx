"use client";
import { useEffect, useState } from "react";
import { use } from "react";
import { notFound, useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { useDispatch } from "react-redux";
import EditInvoice from "./editInvoice";
import AddInvoice from "./addInvoice";
import EditBill from "./editBill";
import {
  getBillByNo,
  deleteBill,
  closeBill,
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

  const canWeekAddInvoices = (week) => {
    return getWeekInvoiceCount(week) < 5;
  };

  // Check if we can add a new week (last week should have exactly 5 invoices)
  const canAddNewWeek = () => {
    if (weeks.length === 0) return false;
    const lastWeek = weeks[weeks.length - 1];
    return hasWeekFiveInvoices(lastWeek);
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
      alert("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const resultAction = await dispatch(addInvoice(formData));
      if (!addInvoice.fulfilled.match(resultAction)) {
        throw new Error("Failed to add invoice.");
      }

      await refreshBillData();
      resetForm();
      setShowAddPopover(false);
    } catch (error) {
      console.error("Failed to add invoice:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const resultAction = await dispatch(updateInvoice(formData));
      if (!updateInvoice.fulfilled.match(resultAction)) {
        throw new Error("Failed to update invoice.");
      }

      await refreshBillData();
      setEditInvoice(null);
    } catch (error) {
      console.error("Failed to update invoice:", error.message);
      alert("Something went wrong while updating invoice.");
    } finally {
      setLoading(false);
    }
  };

  const invoiceDelete = async () => {
    try {
      setLoading(true);
      const resultAction = await dispatch(deleteInvoice(formData.invoiceNo));
      if (!deleteInvoice.fulfilled.match(resultAction)) {
        throw new Error("Failed to delete invoice.");
      }

      await refreshBillData();
      setEditInvoice(null);
    } catch (error) {
      console.error("Failed to delete invoice:", error.message);
      alert("Something went wrong while deleting invoice.");
    } finally {
      setLoading(false);
    }
  };

  const billDelete = async () => {
    try {
      setLoading(true);
      await dispatch(deleteBill(billNo));
      setLoading(false);
      router.push("/bills");
    } catch (error) {
      console.error("Failed to delete bill:", error.message);
      setLoading(false);
    }
  };

  // const billClose = async () => {
  //   try {
  //     setLoading(true);
  //     if (bill.remainingAmount > 0) {
  //       alert("Bill cannot be closed due to remaining amount");
  //       setLoading(false);
  //       return;
  //     }
  //     await dispatch(closeBill(billNo));
  //     setLoading(false);
  //     router.push("/bills");
  //   } catch (error) {
  //     console.error("Failed to close bill:", error);
  //     setLoading(false);
  //   }
  // };

  const billUpdate = async () => {
    setLoading(true);
    try {
      const resultAction = await dispatch(updateBill({ billNo, billForm }));
      if (!updateBill.fulfilled.match(resultAction)) {
        throw new Error("Failed to update Bill.");
      }

      await refreshBillData();
      setShowEditPopover(false);
    } catch (error) {
      console.error("Failed to update Bill:", error.message);
      alert("Something went wrong while updating Bill.");
    } finally {
      setLoading(false);
    }
  };

  const NewWeek = async () => {
    setLoading(true);
    try {
      const resultAction = await dispatch(addWeek(billNo));
      if (!addWeek.fulfilled.match(resultAction)) {
        throw new Error("Failed to add new week.");
      }

      await refreshBillData();
    } catch (error) {
      console.error("Failed to add new week:", error.message);
      alert("Something went wrong while adding new week.");
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
        {bill.status === "active" && (
          <>
            {canAddNewWeek() && (
              <Button
                onClick={NewWeek}
                className="hover:cursor-pointer bg-[var(--ring)] text-white text-xl"
              >
                Add New Week
              </Button>
            )}
            <Button
              onClick={billDelete}
              variant="destructive"
              className="hover:cursor-pointer text-xl"
            >
              Delete Bill
            </Button>
          </>
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
              {bill.customerName} - Week {currentWeek?.weekNo || index + 1}
            </h1>
            <div className="text-sm text-gray-600 mb-4">
              Invoices: {getWeekInvoiceCount(currentWeek)}/5
              {hasWeekFiveInvoices(currentWeek) && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Week Complete
                </span>
              )}
            </div>
          </div>

          {/* Add Invoice Component - Only show if week can accept more invoices and bill is active */}
          {bill.status === "active" && canWeekAddInvoices(currentWeek) && (
            <AddInvoice
              weekNo={currentWeek.weekNo}
              formData={formData}
              handleChange={handleChange}
              handleAdd={handleAdd}
              resetForm={resetForm}
              showAddPopover={showAddPopover}
              setShowAddPopover={setShowAddPopover}
              fiveInvoices={hasWeekFiveInvoices(currentWeek)}
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

          {/* Edit Bill Component - Only show for the first week or when week has invoices */}
          {index === weeks.length - 1 && hasWeekAnyInvoices(currentWeek) && (
            <EditBill
              week={currentWeek}
              billNo={billNo}
              billForm={billForm}
              fiveInvoices={hasWeekFiveInvoices(currentWeek)}
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

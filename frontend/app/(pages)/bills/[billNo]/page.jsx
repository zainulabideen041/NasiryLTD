"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { notFound, useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { useDispatch } from "react-redux";
import EditInvoice from "./editInvoice";
import AddInvoice from "./addInvoice";
import { getBillByNo, deleteBill, closeBill } from "@/redux/bill-slice";
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
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const getBillDetails = async () => {
      const resultAction = await dispatch(getBillByNo(billNo));
      if (getBillByNo.fulfilled.match(resultAction)) {
        const billData = resultAction.payload;
        setBill(billData);
        setInvoices(billData.invoices || []);
        setLoading(false);
      } else {
        console.error("Failed to fetch bill:", resultAction.error);
      }
    };

    getBillDetails();
  }, [billNo, dispatch]);

  if (!bill) return notFound();

  const [editInvoice, setEditInvoice] = useState(null);
  const [showAddPopover, setShowAddPopover] = useState(false);

  const [formData, setFormData] = useState({
    billNo: billNo,
    invoiceNo: "",
    date: "",
    amount: "",
  });

  const resetForm = () =>
    setFormData({ billNo: billNo, invoiceNo: "", date: "", amount: "" });

  const handleRowClick = (invoice) => {
    setEditInvoice(invoice.invoiceNo);
    setFormData({
      billNo: billNo,
      invoiceNo: invoice.invoiceNo,
      date: invoice.date ? invoice.date.split("T")[0] : "",
      amount: invoice.amount,
    });
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAdd = async () => {
    if (!formData.invoiceNo || !formData.date || !formData.amount) {
      alert("All fields are required.");
      return;
    }

    if (formData.amount > bill.remainingAmount) {
      alert("Amount must be less than remaining amount.");
      return;
    }

    setLoading(true);

    try {
      const resultAction = await dispatch(addInvoice(formData));
      if (addInvoice.fulfilled.match(resultAction)) {
        setInvoices([...invoices, resultAction.payload]);
      }
      const Action = await dispatch(getBillByNo(billNo));
      if (getBillByNo.fulfilled.match(Action)) {
        const billData = Action.payload;
        setBill(billData);
        setInvoices(billData.invoices || []);
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to add invoice:", error);
      setLoading(false);
    }

    resetForm();
    setShowAddPopover(false);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const resultAction = await dispatch(updateInvoice(formData));
      if (updateInvoice.fulfilled.match(resultAction)) {
        // Update the invoice in the local state
        setInvoices(
          invoices.map((invoice) =>
            invoice.invoiceNo === formData.invoiceNo
              ? { ...invoice, ...formData }
              : invoice
          )
        );
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Failed to update invoice:", error);
    }

    setEditInvoice(null);
  };

  const invoiceDelete = async () => {
    try {
      const resultAction = await dispatch(deleteInvoice(formData.invoiceNo));
      if (deleteInvoice.fulfilled.match(resultAction)) {
        // Remove the invoice from local state
        setInvoices(
          invoices.filter((invoice) => invoice.invoiceNo !== formData.invoiceNo)
        );
      }
    } catch (error) {
      console.error("Failed to delete invoice:", error);
    }

    setEditInvoice(null);
  };

  const billDelete = async () => {
    try {
      setLoading(true);
      await dispatch(deleteBill(billNo));
      setLoading(false);
      router.push("/bills");
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      setLoading(false);
    }
  };

  const billClose = async () => {
    try {
      setLoading(true);
      if (bill.remainingAmount > 0) {
        alert("Bill cannot be closed due to remaining amount");
        setLoading(false);
      } else {
        await dispatch(closeBill(billNo));
        setLoading(false);
        router.push("/bills");
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to delete invoice:", error);
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
      <h1 className="text-2xl lg:text-4xl lg:font-extrabold font-bold tracking-wide mt-5 ml-5">
        Bill Details for Customer {bill.customerName}
      </h1>

      <AddInvoice
        formData={formData}
        handleChange={handleChange}
        handleAdd={handleAdd}
        resetForm={resetForm}
        showAddPopover={showAddPopover}
        setShowAddPopover={setShowAddPopover}
        bill={bill}
      />

      <EditInvoice
        editInvoice={editInvoice}
        setEditInvoice={setEditInvoice}
        formData={formData}
        handleChange={handleChange}
        handleUpdate={handleUpdate}
        invoiceDelete={invoiceDelete}
        invoices={invoices}
        handleRowClick={handleRowClick}
        bill={bill}
      />

      {invoices.length > 0 ? (
        <Button
          onClick={billClose}
          disabled={bill.remainingAmount > 0}
          className="hover:cursor-pointer bg-[var(--ring)] pl-5 pr-5 w-full sm:w-[70%] ml-1 lg:w-[60%] mr-2 mt-5 text-white text-xl"
        >
          Close Bill
        </Button>
      ) : (
        <Button
          onClick={billDelete}
          className="hover:cursor-pointer bg-[var(--ring)] pl-5 pr-5 w-full sm:w-[70%] ml-1 lg:w-[60%] mr-2 mt-5 text-white text-xl"
        >
          Delete Bill
        </Button>
      )}

      <Button className="hover:cursor-pointer bg-[var(--ring)] pl-5 pr-5 w-full sm:w-[70%] ml-1 lg:w-[60%] mr-2 mt-5 text-white text-xl">
        Edit Bill
      </Button>
    </div>
  );
};

export default BillDetails;

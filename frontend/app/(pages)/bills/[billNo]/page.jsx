"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { getBillByNo } from "@/redux/bill-slice";
import {
  addInvoice,
  deleteInvoice,
  updateInvoice,
} from "@/redux/invoice-slice";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const BillDetails = ({ params }) => {
  const { billNo } = use(params);

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
      } else {
        console.error("Failed to fetch bill:", resultAction.error);
      }
    };

    getBillDetails();
  }, [billNo, dispatch]);

  if (!bill) return notFound();

  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + (invoice.amount || 0),
    0
  );

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

    try {
      const resultAction = await dispatch(addInvoice(formData));
      if (addInvoice.fulfilled.match(resultAction)) {
        // Update local state with the new invoice
        setInvoices([...invoices, resultAction.payload]);
      }
    } catch (error) {
      console.error("Failed to add invoice:", error);
    }

    resetForm();
    setShowAddPopover(false);
  };

  const handleUpdate = async () => {
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
      }
    } catch (error) {
      console.error("Failed to update invoice:", error);
    }

    setEditInvoice(null);
  };

  const handleDelete = async () => {
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

  return (
    <div className="relative w-full p-2 md:p-4">
      <h1 className="text-2xl lg:text-4xl lg:font-extrabold font-bold tracking-wide mt-5 ml-5">
        Bill Details for Customer {bill.customerName}
      </h1>

      {/* --- Add New Invoice Button with Popover --- */}
      <header className="flex justify-center p-5">
        <Popover open={showAddPopover} onOpenChange={setShowAddPopover}>
          <PopoverTrigger asChild>
            <Button
              onClick={resetForm}
              className="hover:cursor-pointer bg-[var(--ring)] text-white text-xl"
            >
              Add New Invoice
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[44vh] md:w-[74vh] xl:w-[100vh]">
            <div className="grid gap-4">
              <h4 className="font-bold text-lg">Add New Invoice</h4>
              <div className="grid gap-2">
                <div className="flex flex-col lg:flex-row justify-between">
                  {/* Date Picker */}
                  <div className="flex items-center gap-2 p-5">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] md:w-[150px] justify-start text-left font-normal",
                            !formData.date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date ? (
                            formData.date
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 text-left"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          onSelect={(selectedDate) => {
                            if (selectedDate) {
                              handleChange(
                                "date",
                                format(selectedDate, "yyyy-MM-dd")
                              );
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Invoice No */}
                  <div className="flex items-center gap-2 p-5">
                    <Label htmlFor="invoiceNo">Invoice</Label>
                    <Input
                      id="invoiceNo"
                      onChange={(e) =>
                        handleChange("invoiceNo", e.target.value)
                      }
                      className="col-span-2 h-8"
                    />
                  </div>

                  {/* Amount */}
                  <div className="flex items-center gap-2 p-5">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      onChange={(e) => handleChange("amount", +e.target.value)}
                      className="col-span-2 h-8"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAdd}
                  className="col-span-3 mt-2 bg-[var(--ring)] text-white hover:cursor-pointer"
                >
                  Add Invoice
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </header>

      {/* --- Invoice Table --- */}
      <Table className="w-[50vh] md:w-[70vh] lg:w-[100vh] text-2xl ml-2 md:ml-5">
        <TableCaption>List of invoices for this bill</TableCaption>
        <TableHeader>
          <TableRow className="flex justify-between">
            <TableHead className="w-[100px] font-bold">Invoice</TableHead>
            <TableHead className="font-bold md:text-center">Date</TableHead>
            <TableHead className="md:text-right font-bold">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <TableRow
                key={invoice.invoiceNo}
                onClick={() => handleRowClick(invoice)}
                className="flex justify-between"
              >
                <TableCell className="font-extralight">
                  {invoice.invoiceNo}
                </TableCell>
                <TableCell className="md:text-center font-extralight">
                  {invoice.date.split("T")[0]}
                </TableCell>
                <TableCell className="md:text-right font-extralight">
                  ${invoice.amount}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <></>
          )}
        </TableBody>
        <TableFooter>
          <TableRow className="flex justify-between">
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right font-semibold">
              ${totalAmount}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {/* --- Edit Invoice Popover --- */}
      {editInvoice && (
        <Popover open onOpenChange={(open) => !open && setEditInvoice(null)}>
          <PopoverTrigger asChild>
            <button className="hidden" aria-hidden="true" />
          </PopoverTrigger>
          <PopoverContent className="absolute top-45 left-2 lg:left-70 justify-center items-center text-center w-[44vh] md:w-[74vh] xl:w-[100vh]">
            <div className="grid gap-4">
              <h4 className="font-bold text-lg">
                Edit Invoice {formData.invoiceNo}
              </h4>
              <div className="grid gap-2">
                <div className="flex flex-col lg:flex-row justify-between">
                  {/* Date */}
                  <div className="flex items-center gap-2 p-5">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] md:w-[150px] justify-start text-left font-normal",
                            !formData.date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date ? (
                            formData.date
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            formData.date ? new Date(formData.date) : undefined
                          }
                          onSelect={(selectedDate) => {
                            if (selectedDate) {
                              handleChange(
                                "date",
                                format(selectedDate, "yyyy-MM-dd")
                              );
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Invoice */}
                  <div className="flex items-center gap-2 p-5">
                    <Label htmlFor="invoice">Invoice</Label>
                    <Input
                      readOnly
                      id="invoiceno"
                      value={formData.invoiceNo}
                      onChange={(e) =>
                        handleChange("invoiceNo", e.target.value)
                      }
                      className="col-span-2 h-8 w-full"
                    />
                  </div>

                  {/* Amount */}
                  <div className="flex items-center gap-2 p-5">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleChange("amount", +e.target.value)}
                      className="col-span-2 h-8 "
                    />
                  </div>
                </div>

                <Button
                  onClick={handleUpdate}
                  className="col-span-3 bg-[var(--ring)] text-white mt-2 hover:cursor-pointer"
                >
                  Update Invoice
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="col-span-3 mt-2 hover:cursor-pointer"
                >
                  Delete Invoice
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
      <Button
        variant="destructive"
        className="hover:cursor-pointer bg-[var(--ring)] pl-5 pr-5 w-full sm:w-[70%] ml-1 lg:w-[50%] mr-2 mt-5 text-white text-xl"
      >
        Close the Bill
      </Button>
    </div>
  );
};

export default BillDetails;

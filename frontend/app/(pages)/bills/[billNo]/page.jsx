"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { notFound, useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Loading from "@/components/Loading";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { getBillByNo, deleteBill, closeBill } from "@/redux/bill-slice";
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

      {/* --- Add New Invoice Button with Popover --- */}
      <header className="flex justify-center p-5">
        {bill.status === "active" && bill.remainingAmount > 0 ? (
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
                        onChange={(e) =>
                          handleChange("amount", +e.target.value)
                        }
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
        ) : (
          <></>
        )}
        {bill.invoices.length > 0 ? (
          <>
            <Button
              onClick={resetForm}
              className="hover:cursor-pointer ml-2 bg-[var(--ring)] text-white text-xl"
            >
              Print Bill
            </Button>
          </>
        ) : (
          <></>
        )}
      </header>

      {/* --- Invoice Table --- */}
      <Table className="w-[50vh] md:w-[70vh] lg:w-[110vh] text-lg md:text-xl ml-2 md:ml-5">
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
                  £{invoice.amount}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <></>
          )}
        </TableBody>
        <TableFooter>
          <TableRow className="flex justify-between">
            <TableCell colSpan={2}>Amount Received by Invoices</TableCell>
            <TableCell className="text-right font-semibold">
              £ {bill.receivedAmount}
            </TableCell>
          </TableRow>
          <TableRow className="flex justify-between">
            <TableCell colSpan={2}>Total Amount to Receive</TableCell>
            <TableCell className="text-right font-semibold">
              £ {bill.totalAmount}
            </TableCell>
          </TableRow>
          <TableRow className="flex justify-between">
            <TableCell colSpan={2}>Remaining Amount</TableCell>
            <TableCell className="text-right font-semibold text-red-700">
              £ {bill.remainingAmount}
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
                  onClick={invoiceDelete}
                  className="col-span-3 mt-2 hover:cursor-pointer"
                >
                  Delete Invoice
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
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

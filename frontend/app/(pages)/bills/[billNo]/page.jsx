"use client";

import { useState } from "react";
import { use } from "react";
import bills from "../bills";
import invoices from "../invoices";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
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
  const { billNo } = use(params); // ✅ Unwrap the promise

  const bill = bills.find((b) => b.billNo === billNo);
  if (!bill) return notFound();

  const relatedInvoices = invoices.filter(
    (invoice) => invoice.billNo === billNo
  );
  const totalAmount = relatedInvoices.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  const [editInvoice, setEditInvoice] = useState(null); // for edit mode
  const [showAddPopover, setShowAddPopover] = useState(false); // for add mode

  const [formData, setFormData] = useState({
    invoiceNo: "",
    date: "",
    amount: "",
  });

  const resetForm = () => setFormData({ invoiceNo: "", date: "", amount: "" });

  const handleRowClick = (invoice) => {
    setEditInvoice(invoice.invoiceNo);
    setFormData({
      invoiceNo: invoice.invoiceNo,
      date: invoice.date,
      amount: invoice.amount,
    });
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAdd = () => {
    console.log("New Invoice:", formData);
    resetForm();
    setShowAddPopover(false);
  };

  const handleUpdate = () => {
    console.log("Updated Invoice:", formData);
    setEditInvoice(null);
  };

  const handleDelete = () => {
    console.log("Deleted Invoice:", formData);
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
            <Button className="hover:cursor-pointer bg-[var(--ring)] text-white text-xl">
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
                            "w-[240px] justify-start text-left font-normal",
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
          {relatedInvoices.map((invoice) => (
            <TableRow
              key={invoice.invoiceNo}
              onClick={() => handleRowClick(invoice)}
              className="flex justify-between"
            >
              <TableCell className="font-extralight">
                {invoice.invoiceNo}
              </TableCell>
              <TableCell className="md:text-center font-extralight">
                {invoice.date}
              </TableCell>
              <TableCell className="md:text-right font-extralight">
                ${invoice.amount}
              </TableCell>
            </TableRow>
          ))}
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
                            "w-[240px] justify-start text-left font-normal",
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
                    <Label htmlFor="date">Invoice</Label>
                    <Input
                      id="date"
                      value={formData.invoiceNo}
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
                      value={formData.amount}
                      onChange={(e) => handleChange("amount", +e.target.value)}
                      className="col-span-2 h-8"
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
    </div>
  );
};

export default BillDetails;

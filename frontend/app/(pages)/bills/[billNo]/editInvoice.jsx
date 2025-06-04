import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PrintReceipt from "./PrintReceipt";

const EditInvoice = ({
  editInvoice,
  setEditInvoice,
  week,
  invoiceLength,
  formData,
  handleChange,
  handleUpdate,
  invoiceDelete,
  handleRowClick,
  resetForm,
  bill,
}) => {
  return (
    <div>
      {invoiceLength ? (
        <PrintReceipt
          week={week}
          customerName={bill.customerName}
          onSuccess={resetForm}
          buttonText="Print Bill"
          className="hover:cursor-pointer m-2 bg-green-600 text-white text-xl"
        />
      ) : (
        <></>
      )}
      <div>
        <Table className="w-[50vh] md:w-[70vh] lg:w-[110vh] text-lg md:text-xl ml-2 md:ml-5">
          <TableHeader>
            <TableRow className="flex justify-between">
              <TableHead className="w-[100px] font-bold">Invoice</TableHead>
              <TableHead className="font-bold md:text-center">Date</TableHead>
              <TableHead className="md:text-right font-bold">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {week.invoices.length > 0 ? (
              week.invoices.map((invoice) => (
                <TableRow
                  key={invoice.invoiceNo}
                  onClick={() => handleRowClick(invoice, week.weekNo)}
                  className="flex justify-between"
                >
                  <TableCell className="font-extralight">
                    {invoice.invoiceNo}
                  </TableCell>
                  <TableCell className="md:text-center font-extralight">
                    {invoice.invoiceDate?.split("T")[0] ?? "N/A"}
                  </TableCell>
                  <TableCell className="md:text-right font-extralight">
                    £{invoice.invoiceAmount}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <p className="flex justify-center p-8 text-2xl">
                No Invoices Added yet
              </p>
            )}
          </TableBody>
          <TableFooter>
            <TableRow className="flex justify-between">
              <TableCell colSpan={2}>Amount Received</TableCell>
              <TableCell className="text-right font-semibold">
                £ {week.receivedAmount}
              </TableCell>
            </TableRow>
            <TableRow className="flex justify-between">
              <TableCell colSpan={2}>Remaining Amount</TableCell>
              <TableCell className="text-right font-semibold text-red-700">
                £ {week.remainingAmount}
              </TableCell>
            </TableRow>
            <TableRow className="flex justify-between">
              <TableCell colSpan={2}>Total Amount</TableCell>
              <TableCell className="text-right font-semibold">
                £ {week.totalAmount}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

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
                      onChange={(e) => handleChange("amount", e.target.value)}
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
    </div>
  );
};

export default EditInvoice;

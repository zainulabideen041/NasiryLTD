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
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const EditInvoice = ({
  editInvoice,
  setEditInvoice,
  formData,
  handleChange,
  handleUpdate,
  invoiceDelete,
  invoices,
  handleRowClick,
  bill,
}) => {
  return (
    <div>
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
    </div>
  );
};

export default EditInvoice;

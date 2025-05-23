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

const addInvoice = ({
  bill,
  showAddPopover,
  setShowAddPopover,
  resetForm,
  formData,
  handleChange,
  handleAdd,
}) => {
  return (
    <div className="flex justify-center p-5">
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
                      onChange={(e) => handleChange("amount", e.target.value)}
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
    </div>
  );
};

export default addInvoice;

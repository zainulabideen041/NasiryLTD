import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EditBill = ({
  week,
  billForm,
  showEditPopover,
  setShowEditPopover,
  handleChange,
  billUpdate,
  billNo,
  fiveInvoices,
  resetForm,
}) => {
  return (
    <div>
      <Popover open={showEditPopover} onOpenChange={setShowEditPopover}>
        <PopoverTrigger asChild>
          <Button
            onClick={() => {
              resetForm();
              handleChange("weekNo", week.weekNo);
            }}
            className="hover:cursor-pointer bg-[var(--ring)] pl-5 pr-5 w-full sm:w-[70%] ml-1 lg:w-[60%] mr-2 mt-5 text-white text-xl"
          >
            Edit Bill
          </Button>
        </PopoverTrigger>
        <PopoverContent className="h-full justify-center items-center text-center w-[44vh] md:w-[74vh] xl:w-[100vh]">
          <div className="grid gap-2">
            <h4 className="font-bold text-lg">
              Edit Bill {billNo} and Add Received Amount for Week {week.weekNo}
            </h4>
            <div className="grid gap-1">
              <div className="flex flex-col lg:flex-row flex-wrap justify-between">
                {/* Invoice */}
                <div className="flex flex-col items-center gap-2 p-2">
                  <Label htmlFor="billNo">Bill</Label>
                  <Input
                    readOnly
                    id="billNo"
                    value={billForm.billNo}
                    className="col-span-2 h-8 w-full"
                  />
                </div>

                {/* Name */}
                <div className="flex flex-col items-center gap-2 p-5">
                  <Label htmlFor="customerName">Name</Label>
                  <Input
                    id="customerName"
                    type="text"
                    value={billForm.customerName}
                    onChange={(e) =>
                      handleChange("customerName", e.target.value)
                    }
                    className="col-span-2 h-8"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col items-center gap-2 p-5">
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={billForm.customerPhone}
                    onChange={(e) =>
                      handleChange("customerPhone", e.target.value)
                    }
                    className="col-span-2 h-8 "
                  />
                </div>

                {/* Address */}
                <div className="flex flex-col items-center gap-2 p-5">
                  <Label htmlFor="customerAddress">Address</Label>
                  <Input
                    id="customerAddress"
                    type="text"
                    value={billForm.customerAddress}
                    onChange={(e) =>
                      handleChange("customerAddress", e.target.value)
                    }
                    className="col-span-2 h-8 "
                  />
                </div>

                {/* Area */}
                <div className="flex flex-col items-center gap-2 p-5">
                  <Label htmlFor="customerArea">Area</Label>
                  <Input
                    id="customerArea"
                    type="text"
                    value={billForm.customerArea}
                    onChange={(e) =>
                      handleChange("customerArea", e.target.value)
                    }
                    className="col-span-2 h-8 "
                  />
                </div>

                {/* Amount */}
                <div className="flex flex-col items-center gap-2 p-5">
                  <Label htmlFor="receivedAmount">Amount Received</Label>
                  <Input
                    id="receivedAmount"
                    disabled={!fiveInvoices}
                    type="number"
                    value={billForm.receivedAmount}
                    onChange={(e) =>
                      handleChange("receivedAmount", e.target.value)
                    }
                    className="col-span-2 h-8 "
                  />
                </div>
              </div>

              <Button
                onClick={billUpdate}
                className="col-span-3 bg-[var(--ring)] text-white mt-2 hover:cursor-pointer"
              >
                Update Bill
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default EditBill;

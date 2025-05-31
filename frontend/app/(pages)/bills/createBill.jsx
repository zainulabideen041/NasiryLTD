import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const createBill = ({
  showAddPopover,
  setShowAddPopover,
  resetForm,
  formData,
  handleChange,
  handleCreate,
  loading,
}) => {
  return (
    <div>
      <Popover open={showAddPopover} onOpenChange={setShowAddPopover}>
        <PopoverTrigger asChild>
          <Button
            onClick={resetForm}
            className="w-[95%] hover:cursor-pointer mt-3 ml-4 mr-4 bg-[var(--ring)] text-white text-xl"
          >
            Create New Bill
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[44vh] md:w-[74vh] xl:w-[100vh]">
          <div className="grid gap-4">
            <h4 className="font-bold text-lg">Create New Bill</h4>
            <div className="grid gap-2">
              <div className="flex flex-col lg:flex-row flex-wrap justify-around">
                <div className="flex items-center gap-2 p-5">
                  <Label htmlFor="customerName">Customer</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) =>
                      handleChange("customerName", e.target.value)
                    }
                    className="col-span-2 h-8"
                    placeholder="Customer Name"
                  />
                </div>

                <div className="flex items-center gap-2 p-5">
                  <Label htmlFor="customerAddress">Address</Label>
                  <Input
                    id="customerAddress"
                    value={formData.customerAddress}
                    onChange={(e) =>
                      handleChange("customerAddress", e.target.value)
                    }
                    className="col-span-2 h-8"
                    placeholder="Customer Address"
                  />
                </div>

                <div className="flex items-center gap-2 p-5">
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) =>
                      handleChange("customerPhone", e.target.value)
                    }
                    className="col-span-2 h-8"
                    placeholder="Customer Phone"
                  />
                </div>

                <div className="flex items-center gap-2 p-5">
                  <Label htmlFor="customerArea">Area</Label>
                  <Input
                    id="customerArea"
                    type="text"
                    value={formData.customerArea}
                    onChange={(e) =>
                      handleChange("customerArea", e.target.value)
                    }
                    className="col-span-2 h-8"
                    placeholder="Customer Area"
                  />
                </div>
              </div>

              <Button
                onClick={handleCreate}
                disabled={loading}
                className="col-span-3 mt-2 bg-[var(--ring)] text-white hover:cursor-pointer"
              >
                {loading ? "Creating Bill Please wait.." : "Create Bill"}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default createBill;

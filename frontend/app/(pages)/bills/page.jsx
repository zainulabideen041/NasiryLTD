"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ActiveBills from "./active";
import ClosedBills from "./closed";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { getAllBills, createBill } from "@/redux/bill-slice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Page = () => {
  const dispatch = useDispatch();
  const [bills, setBills] = useState([]);
  const [showAddPopover, setShowAddPopover] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerAddress: "",
    customerPhone: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      const result = await dispatch(getAllBills());
      if (result.payload && Array.isArray(result.payload)) {
        setBills(result.payload);
        setLoading(false);
      } else {
        setBills([]);
        setLoading(false);
      }
    };

    fetchBills();
  }, [dispatch]);

  const activeBills = bills.filter(
    (bill) => bill.status?.toLowerCase() === "active"
  );
  const closedBills = bills.filter(
    (bill) => bill.status?.toLowerCase() === "closed"
  );

  const resetForm = () =>
    setFormData({
      customerName: "",
      customerAddress: "",
      customerPhone: "",
    });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const { customerName, customerAddress, customerPhone } = formData;
    if (!customerName || !customerAddress || !customerPhone) {
      alert("Please fill all the fields.");
      return;
    }

    try {
      const res = await dispatch(createBill(formData));
      if (createBill.fulfilled.match(res)) {
        setBills((prev) => [...prev, res.payload]);
      }
      resetForm();
      setShowAddPopover(false);
    } catch (error) {
      console.error("An Error Occurred:", error);
    }
  };

  return (
    <>
      {loading ? (
        <div className="h-[80vh] flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <main className="flex flex-col w-full">
          <Popover open={showAddPopover} onOpenChange={setShowAddPopover}>
            <PopoverTrigger asChild>
              <Button
                onClick={resetForm}
                className="hover:cursor-pointer mt-3 ml-4 mr-4 bg-[var(--ring)] text-white text-xl"
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
                  </div>

                  <Button
                    onClick={handleCreate}
                    className="col-span-3 mt-2 bg-[var(--ring)] text-white hover:cursor-pointer"
                  >
                    Create Bill
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {bills.length > 0 ? (
            <>
              {/* Active Bills */}
              <ActiveBills activeBills={activeBills} />

              {/* Closed Bills */}
              <ClosedBills closedBills={closedBills} />
            </>
          ) : (
            <h1 className="text-2xl text-center mt-10 font-semibold">
              NO BILLS AVAILABLE
            </h1>
          )}
        </main>
      )}
    </>
  );
};

export default Page;

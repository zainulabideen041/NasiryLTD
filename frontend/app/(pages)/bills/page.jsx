"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getAllBills, createBill } from "@/redux/bill-slice";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
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

  useEffect(() => {
    const fetchBills = async () => {
      const result = await dispatch(getAllBills());
      if (result.payload && Array.isArray(result.payload)) {
        setBills(result.payload);
      } else {
        setBills([]);
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
    try {
      const res = await dispatch(createBill(formData));
      if (createBill.fulfilled.match(res)) {
        setBills([...bills, res.payload]);
      }
      resetForm();
      setShowAddPopover(false);
    } catch (error) {
      console.error("An Error Occurred:", error);
    }
  };

  return (
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
                    onChange={(e) =>
                      handleChange("customerPhone", +e.target.value)
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
          {activeBills.length > 0 && (
            <>
              <h1 className="text-2xl lg:text-4xl font-bold tracking-wide mt-5 ml-5">
                ACTIVE BILLS
              </h1>
              <div className="w-full flex flex-wrap">
                {activeBills.map((bill) => (
                  <Link
                    href={`/bills/${bill.billNo}`}
                    key={bill.billNo}
                    className="border hover:border-[var(--ring)] p-5 lg:p-6 w-full sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] rounded-lg shadow bg-white dark:hover:bg-gray-950 dark:bg-black m-3 lg:m-6 hover:bg-gray-50"
                  >
                    <p className="text-2xl lg:text-3xl mb-3 text-center font-bold">
                      {bill.customerName}
                    </p>
                    <p className="text-xl">
                      <strong>Bill No:</strong> {bill.billNo}
                    </p>
                    <p className="text-xl">
                      <strong>Address:</strong> {bill.customerAddress}
                    </p>
                    <p className="text-xl">
                      <strong>Phone:</strong> {bill.customerPhone}
                    </p>
                    <p className="text-xl">
                      <strong>Created Date:</strong>
                      {new Date(bill.createdDate).toLocaleDateString()}
                    </p>
                    <p className="mt-3 text-center">
                      <Badge className="bg-[var(--ring)] text-white">
                        {bill.status}
                      </Badge>
                    </p>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Closed Bills */}
          {closedBills.length > 0 && (
            <>
              <h1 className="text-2xl lg:text-4xl font-bold tracking-wide mt-5 ml-5">
                CLOSED BILLS
              </h1>
              <div className="w-full flex flex-wrap">
                {closedBills.map((bill) => (
                  <Link
                    href={`/bills/${bill.billNo}`}
                    key={bill.billNo}
                    className="border hover:border-[var(--ring)] p-5 lg:p-6 w-full sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] rounded-lg shadow bg-white dark:hover:bg-gray-950 dark:bg-black m-3 lg:m-6 hover:bg-gray-50"
                  >
                    <p className="text-3xl mb-3 text-center font-bold">
                      {bill.customerName}
                    </p>
                    <p className="text-xl">
                      <strong>Bill No:</strong> {bill.billNo}
                    </p>
                    <p className="text-xl">
                      <strong>Address:</strong> {bill.customerAddress}
                    </p>
                    <p className="text-xl">
                      <strong>Created Date:</strong>{" "}
                      {new Date(bill.createdDate).toLocaleDateString()}
                    </p>
                    <p className="text-xl">
                      <strong>Final Date:</strong> {bill.finalDate}
                    </p>
                    <p className="mt-3 text-center">
                      <Badge variant="destructive">{bill.status}</Badge>
                    </p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <h1 className="text-2xl text-center mt-10 font-semibold">
          NO BILLS AVAILABLE
        </h1>
      )}
    </main>
  );
};

export default Page;

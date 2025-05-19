"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getAllBills } from "@/redux/bill-slice";

const Page = () => {
  const dispatch = useDispatch();
  const [bills, setBills] = useState([]);

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

  return (
    <main className="flex flex-col w-full">
      <Button className="hover:cursor-pointer mt-3 ml-4 mr-4 bg-[var(--ring)] text-white text-xl">
        Create New Bill
      </Button>

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
                      <strong>Final Date:</strong> {bill.finalDate}
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

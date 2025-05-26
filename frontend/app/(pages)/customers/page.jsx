"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllBills } from "@/redux/bill-slice";
import Loading from "@/components/Loading";
import Customers from "./customers";

const Page = () => {
  const [bills, setBills] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBills = async () => {
      const result = await dispatch(getAllBills({ userId }));

      if (result.payload && Array.isArray(result.payload)) {
        setBills(result.payload);
      }
      setLoading(false);
    };

    fetchBills();
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <div className="h-[80vh] flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <main className="w-full">
          <h1 className="text-2xl lg:text-4xl lg:font-extrabold font-bold tracking-wide mt-5 ml-5">
            ALL CUSTOMERS
          </h1>
          {bills.length > 0 ? (
            <>
              <Customers bills={bills} />
            </>
          ) : (
            <div className="text-4xl flex justify-center min-h-[60vh] items-center">
              Customers Not Found
            </div>
          )}
        </main>
      )}
    </>
  );
};

export default Page;

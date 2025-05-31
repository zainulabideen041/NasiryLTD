"use client";

import ActiveBills from "./active";
import ClosedBills from "./closed";
import { useDispatch, useSelector } from "react-redux";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { getAllBills, createBill } from "@/redux/bill-slice";
import CreateBill from "./createBill";

const Page = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;
  const [bills, setBills] = useState([]);
  const [showAddPopover, setShowAddPopover] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerAddress: "",
    customerPhone: "",
    customerArea: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      const result = await dispatch(getAllBills({ userId }));
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
      customerArea: "",
    });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { customerName, customerAddress, customerPhone, customerArea } =
      formData;
    if (!customerName || !customerAddress || !customerPhone || !customerArea) {
      alert("Please fill all the fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await dispatch(createBill({ billData: formData, userId }));
      if (createBill.fulfilled.match(res)) {
        setBills((prev) => [...prev, res.payload]);
      }
      resetForm();
      setLoading(false);
      setShowAddPopover(false);
    } catch (error) {
      setLoading(false);
      console.error("An Error Occurred:", error.message);
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
          {/* create bill popover  */}
          <CreateBill
            showAddPopover={showAddPopover}
            setShowAddPopover={setShowAddPopover}
            resetForm={resetForm}
            formData={formData}
            handleChange={handleChange}
            handleCreate={handleCreate}
            loading={loading}
            setLoading={setLoading}
          />

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

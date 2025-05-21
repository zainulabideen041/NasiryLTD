"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck, ShieldX } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBills } from "@/redux/bill-slice";
import Loading from "@/components/Loading";
import gsap from "gsap";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hoveredBox, setHoveredBox] = useState(null);
  const activeCountRef = useRef(null);
  const closedCountRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const [totalBillCount, setTotalBillCount] = useState(0);
  const [activeBillCount, setActiveBillCount] = useState(0);
  const [closedBillCount, setClosedBillCount] = useState(0);

  // Fetch bills data
  useEffect(() => {
    const fetchBills = async () => {
      setIsLoading(true);
      try {
        const result = await dispatch(getAllBills());

        if (result.payload && Array.isArray(result.payload)) {
          const bills = result.payload;

          let active = 0;
          let closed = 0;

          for (const bill of bills) {
            if (bill.status === "Active") active++;
            else if (bill.status === "Closed") closed++;
          }

          setTotalBillCount(bills.length);
          setActiveBillCount(active);
          setClosedBillCount(closed);
        } else {
          setTotalBillCount(0);
          setActiveBillCount(0);
          setClosedBillCount(0);
        }
      } catch (error) {
        console.error("Error fetching bills:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBills();
  }, [dispatch]);

  // GSAP counters - only run when data is available and refs are ready
  useEffect(() => {
    // Only run animation if we're not loading and refs exist
    if (!isLoading && activeCountRef.current && closedCountRef.current) {
      const animateCount = (ref, value) => {
        // Start from current displayed value (or 0 if none)
        const startValue = parseInt(ref.current.innerText) || 0;
        const obj = { val: startValue };

        gsap.to(obj, {
          val: value,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            if (ref.current) {
              ref.current.innerText = Math.round(obj.val);
            }
          },
        });
      };

      animateCount(activeCountRef, activeBillCount);
      animateCount(closedCountRef, closedBillCount);
    }
  }, [activeBillCount, closedBillCount, totalBillCount, isLoading]);

  const handleMouseMove = (e, boxId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setHoveredBox(boxId);
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <main className="w-full">
      <h1 className="text-2xl lg:text-4xl lg:font-extrabold font-bold tracking-wide mt-5 ml-5">
        DASHBOARD
      </h1>

      <div className="flex flex-col md:flex-row flex-wrap">
        {/* Active Bills Box */}
        <div
          onMouseMove={(e) => handleMouseMove(e, "active")}
          onMouseLeave={() => setHoveredBox(null)}
          className="relative border p-5 lg:p-6 w-[90%] md:w-[50%] lg:w-[40%] xl:w-[35%] 2xl:w-[25%] rounded-lg shadow bg-white dark:bg-black m-5 lg:m-6 overflow-hidden"
        >
          {hoveredBox === "active" && (
            <div
              className="pointer-events-none absolute w-40 h-40 rounded-full dark:bg-white/10 bg-black/10 backdrop-blur-xl blur-3xl transition-all duration-100 z-0"
              style={{
                top: cursorPos.y - 80,
                left: cursorPos.x - 80,
              }}
            />
          )}

          <div className="flex justify-between cursor-default select-none relative z-10">
            <div>
              <h2 className="mb-3 text-xl font-semibold">Active Bills</h2>
              <p
                ref={activeCountRef}
                className="text-5xl font-bold text-gray-800 dark:text-white"
              >
                0
              </p>
            </div>
            <ShieldCheck size={80} />
          </div>
        </div>

        {/* Closed Bills Box */}
        <div
          onMouseMove={(e) => handleMouseMove(e, "closed")}
          onMouseLeave={() => setHoveredBox(null)}
          className="relative border p-5 lg:p-6 w-[90%] md:w-[50%] lg:w-[40%] xl:w-[35%] 2xl:w-[25%] rounded-lg shadow bg-white dark:bg-black m-5 lg:m-6 overflow-hidden"
        >
          {hoveredBox === "closed" && (
            <div
              className="pointer-events-none absolute w-40 h-40 rounded-full dark:bg-white/10 bg-black/10 backdrop-blur-xl blur-3xl transition-all duration-100 z-0"
              style={{
                top: cursorPos.y - 80,
                left: cursorPos.x - 80,
              }}
            />
          )}

          <div className="flex justify-between cursor-default select-none relative z-10">
            <div>
              <h2 className="mb-3 text-xl font-semibold">Closed Bills</h2>
              <p
                ref={closedCountRef}
                className="text-5xl font-bold text-gray-800 dark:text-white"
              >
                0
              </p>
            </div>
            <ShieldX size={80} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;

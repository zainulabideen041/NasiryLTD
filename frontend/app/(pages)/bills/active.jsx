"use client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const Active = ({ activeBills }) => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hoveredBox, setHoveredBox] = useState(null);

  const handleMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setHoveredBox(index);
  };

  return (
    <div>
      {activeBills.length > 0 && (
        <>
          <h1 className="text-2xl lg:text-4xl font-bold tracking-wide mt-5 ml-5">
            ACTIVE BILLS
          </h1>
          <div className="w-full flex flex-wrap">
            {activeBills.map((bill, index) => (
              <Link
                href={`/bills/${bill.billNo}`}
                key={bill.billNo}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={() => setHoveredBox(null)}
                className="relative border hover:border-[var(--ring)] p-5 lg:p-6 w-full sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] rounded-lg shadow bg-white dark:bg-black m-3 lg:m-6 hover:bg-gray-50 overflow-hidden"
              >
                {/* Bokeh Glow */}
                {hoveredBox === index && (
                  <div
                    className="pointer-events-none absolute w-40 h-40 rounded-full dark:bg-white/10 bg-black/10 backdrop-blur-xl blur-3xl transition-all duration-100 z-0"
                    style={{
                      top: cursorPos.y - 80,
                      left: cursorPos.x - 80,
                    }}
                  />
                )}

                {/* Content */}
                <div className="relative z-10">
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
                    <strong>Created Date:</strong>{" "}
                    {new Date(bill.createdDate).toLocaleDateString()}
                  </p>
                  <p className="mt-3 text-center">
                    <Badge className="bg-[var(--ring)] text-white">
                      {bill.status}
                    </Badge>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Active;

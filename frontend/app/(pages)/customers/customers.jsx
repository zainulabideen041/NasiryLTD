"use client";

import React, { useState } from "react";

const Customers = ({ bills }) => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hoveredBox, setHoveredBox] = useState(null);

  // Group bills by unique customer phone
  const customerMap = new Map();

  for (const bill of bills) {
    const phone = bill.customerPhone?.trim();
    if (!phone) continue;

    if (!customerMap.has(phone)) {
      customerMap.set(phone, {
        customerName: bill.customerName,
        customerPhone: bill.customerPhone,
        customerAddress: bill.customerAddress,
        bills: [],
      });
    }

    customerMap.get(phone).bills.push(bill);
  }

  const customers = Array.from(customerMap.values());

  customers.sort((a, b) => {
    const aHasActive = a.bills.some((bill) => bill.status === "active");
    const bHasActive = b.bills.some((bill) => bill.status === "active");

    if (aHasActive && !bHasActive) return -1;
    if (!aHasActive && bHasActive) return 1;
    return 0;
  });

  const handleMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setHoveredBox(index);
  };

  return (
    <div className="m-5 flex flex-row flex-wrap gap-10">
      {customers.map((customer, index) => (
        <div
          key={index}
          onMouseMove={(e) => handleMouseMove(e, index)}
          onMouseLeave={() => setHoveredBox(null)}
          className="relative border p-5 w-[90%] md:w-[48%] lg:w-[30%] xl:w-[25%] rounded-lg shadow bg-white dark:bg-black overflow-hidden"
        >
          {hoveredBox === index && (
            <div
              className="pointer-events-none absolute w-40 h-40 rounded-full dark:bg-white/10 bg-black/10 backdrop-blur-xl blur-3xl transition-all duration-100 z-0"
              style={{
                top: cursorPos.y - 80,
                left: cursorPos.x - 80,
              }}
            />
          )}

          <div className="relative z-10">
            <p className="text-lg font-semibold">
              <strong>Name:</strong> {customer.customerName}
            </p>
            <p className="text-md text-gray-700 dark:text-gray-300">
              <strong>Phone:</strong> {customer.customerPhone}
            </p>
            <p className="text-md text-gray-700 dark:text-gray-300">
              <strong>Address:</strong> {customer.customerAddress}
            </p>

            <hr className="my-3 border-gray-300 dark:border-gray-600" />

            <p className="text-md font-semibold mb-2">Related Bills:</p>
            <ul className="text-sm space-y-2">
              {customer.bills.map((bill, i) => (
                <li
                  key={i}
                  className="border rounded p-2 bg-gray-50 dark:bg-gray-800"
                >
                  <p>
                    <strong>Bill No:</strong> {bill.billNo}
                  </p>
                  <p>
                    <strong>Status: </strong>
                    <span
                      className={
                        bill.status === "closed"
                          ? "text-red-600"
                          : "text-green-500"
                      }
                    >
                      {bill.status}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Customers;

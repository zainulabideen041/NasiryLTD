"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const Customers = ({ bills }) => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hoveredBox, setHoveredBox] = useState(null);
  const [selectedArea, setSelectedArea] = useState(""); // State for area filter

  const router = useRouter();

  const handleCustomerClick = (billNo) => {
    router.push(`/bills/${billNo}`);
  };

  // Group bills by unique customer phone and get unique areas
  const { customers, uniqueAreas } = useMemo(() => {
    const customerMap = new Map();
    const areaSet = new Set();

    for (const bill of bills) {
      const phone = bill.customerPhone?.trim();
      if (!phone) continue;

      // Add area to set if it exists
      if (bill.customerArea?.trim()) {
        areaSet.add(bill.customerArea.trim());
      }

      if (!customerMap.has(phone)) {
        customerMap.set(phone, {
          customerName: bill.customerName,
          customerPhone: bill.customerPhone,
          customerAddress: bill.customerAddress,
          customerArea: bill.customerArea,
          bills: [],
        });
      }
      customerMap.get(phone).bills.push(bill);
    }

    let customersArray = Array.from(customerMap.values());

    // Sort customers (active bills first)
    customersArray.sort((a, b) => {
      const aHasActive = a.bills.some((bill) => bill.status === "active");
      const bHasActive = b.bills.some((bill) => bill.status === "active");
      if (aHasActive && !bHasActive) return -1;
      if (!aHasActive && bHasActive) return 1;
      return 0;
    });

    // Filter by selected area if area is selected
    if (selectedArea) {
      customersArray = customersArray.filter(
        (customer) => customer.customerArea?.trim() === selectedArea
      );
    }

    return {
      customers: customersArray,
      uniqueAreas: Array.from(areaSet).sort(),
    };
  }, [bills, selectedArea]);

  const handleMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setHoveredBox(index);
  };

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  return (
    <div className="m-5">
      {/* Area Filter */}
      <div className="mb-6">
        <label
          htmlFor="area-filter"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Filter by Area:
        </label>
        <select
          id="area-filter"
          value={selectedArea}
          onChange={handleAreaChange}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-[200px]"
        >
          <option value="">All Areas</option>
          {uniqueAreas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
        {selectedArea && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Showing {customers.length} customer
            {customers.length !== 1 ? "s" : ""} from "{selectedArea}"
          </p>
        )}
      </div>

      {/* Customers Grid */}
      <div className="flex flex-row flex-wrap gap-10">
        {customers.length > 0 ? (
          customers.map((customer, index) => (
            <div
              key={index}
              onClick={() => handleCustomerClick(customer.bills[0]?.billNo)}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => setHoveredBox(null)}
              className="relative border p-5 w-[90%] md:w-[48%] lg:w-[30%] xl:w-[25%] rounded-lg shadow bg-white dark:bg-black overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
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
                <p className="text-xl md:text-2xl font-semibold">
                  <strong className="text-lg">Name:</strong>{" "}
                  {customer.customerName}
                </p>
                <p className="text-md text-gray-700 dark:text-gray-300">
                  <strong>Phone:</strong> {customer.customerPhone}
                </p>
                <p className="text-md text-gray-700 dark:text-gray-300">
                  <strong>Address:</strong> {customer.customerAddress}
                </p>
                {customer.customerArea && (
                  <p className="text-md text-gray-700 dark:text-gray-300">
                    <strong>Area:</strong> {customer.customerArea}
                  </p>
                )}
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
          ))
        ) : (
          <div className="w-full text-center py-8">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {selectedArea
                ? `No customers found in "${selectedArea}" area`
                : "No customers found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;

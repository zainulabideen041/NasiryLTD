import Link from "next/link";
import bills from "./bills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const page = () => {
  const activeBills = bills.filter(
    (bill) => bill.status.toLowerCase() === "active"
  );
  const closedBills = bills.filter(
    (bill) => bill.status.toLowerCase() === "closed"
  );

  return (
    <main className="flex flex-col w-full">
      {/* Active Bills */}
      {activeBills.length > 0 && (
        <>
          <h1 className="flex justify-between items-center text-2xl lg:text-4xl lg:font-extrabold font-bold tracking-wide mt-5 ml-5">
            ACTIVE BILLS
            <Button className="hover:cursor-pointer mr-8 bg-[var(--ring)] text-white text-xl">
              Create New Bill
            </Button>
          </h1>
          <div className="w-full flex flex-row flex-wrap">
            {activeBills.map((bill) => (
              <Link
                href={`/bills/${bill.billNo}`}
                key={bill.billNo}
                className="border border-transparent hover:border-[var(--ring)] transition-colors p-5 lg:p-6 w-full sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] rounded-lg shadow bg-white dark:hover:bg-gray-950 dark:bg-black m-3 lg:m-6 hover:cursor-pointer hover:bg-gray-50"
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
          <h1 className="text-2xl lg:text-4xl lg:font-extrabold font-bold tracking-wide mt-5 ml-5">
            CLOSED BILLS
          </h1>
          <div className="flex flex-row flex-wrap">
            {closedBills.map((bill) => (
              <Link
                href={`/bills/${bill.billNo}`}
                key={bill.billNo}
                className="border border-transparent hover:border-[var(--ring)] transition-colors p-5 lg:p-6 w-full sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] rounded-lg shadow bg-white dark:hover:bg-gray-950 dark:bg-black m-3 lg:m-6 hover:cursor-pointer hover:bg-gray-50"
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
    </main>
  );
};

export default page;

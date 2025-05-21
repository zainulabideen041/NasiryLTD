import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const Active = ({ activeBills }) => {
  return (
    <div>
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
    </div>
  );
};

export default Active;

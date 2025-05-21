"use client";

import Billcards from "./bill-cards";

const Dashboard = () => {
  return (
    <main className="w-full">
      <h1 className="text-2xl lg:text-4xl lg:font-extrabold font-bold tracking-wide mt-5 ml-5">
        DASHBOARD
      </h1>

      <Billcards />
    </main>
  );
};

export default Dashboard;

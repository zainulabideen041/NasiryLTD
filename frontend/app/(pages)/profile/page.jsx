"use client";

import { useSelector } from "react-redux";
import Loading from "@/components/Loading";
import Profile from "./profile";
// import { useState } from "react";

const page = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      {user ? (
        <main className="w-full">
          <h1 className="text-2xl lg:text-4xl lg:font-extrabold font-bold tracking-wide mt-5 ml-5">
            PROFILE PAGE UNDER DEVELOPED
          </h1>
          <Profile />
        </main>
      ) : (
        <div className="h-[80vh] flex items-center justify-center">
          <Loading />
        </div>
      )}
    </>
  );
};

export default page;

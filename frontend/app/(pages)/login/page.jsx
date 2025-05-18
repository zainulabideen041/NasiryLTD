"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import Link from "next/link";

const Login = () => {
  const router = useRouter();

  const NavigateDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-3xl lg:text-5xl text-center font-extrabold p-5">
        Login to your Account
      </div>
      <div className="relative w-full max-w-xl items-center gap-1.5 border rounded-xl mt-4 md:mt-7 mr-1 ml-1 p-15">
        <Label htmlFor="email" className="text-lg font-bold">
          Email
        </Label>
        <Input
          type="email"
          id="email"
          placeholder="Enter your Email Address here"
          className="text-lg md:text-xl"
        />
        <Label htmlFor="password" className="text-lg font-bold mt-8">
          Password
        </Label>
        <Input
          type="password"
          id="password"
          placeholder="Enter your Password here"
          className="text-lg md:text-xl"
        />
        <Link
          href=""
          className="absolute right-15 bottom-2 dark:text-red-400 dark:hover:text-red-300 text-red-400 hover:text-red-500"
        >
          Forgot Password?
        </Link>
      </div>
      <Button
        onClick={NavigateDashboard}
        className="dark:text-white w-[30%] mt-8 hover:cursor-pointer text-lg bg-[var(--ring)] hover:bg-green-800 font-bold"
      >
        <LogIn size={20} /> Login
      </Button>
    </div>
  );
};

export default Login;

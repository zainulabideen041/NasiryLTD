"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { loginUser } from "@/redux/auth-slice";
import { useDispatch } from "react-redux";
import { Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();

    if (!formData.email || !formData.password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter both email and password.",
      });
      return;
    }

    // Set loading state before API call
    setLoading(true);

    try {
      const res = await dispatch(loginUser(formData));

      if (res?.payload?.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.payload.message,
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: res.payload?.message || "An Error Occurred.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      // Always set loading to false after API call completes
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center px-4">
      <h1 className="text-3xl lg:text-5xl text-center font-extrabold p-5">
        Login to your Account
      </h1>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-xl border rounded-xl p-6 flex flex-col gap-4"
      >
        <div>
          <Label htmlFor="email" className="text-lg font-bold">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            placeholder="Enter your Email Address"
            value={formData.email}
            onChange={onChange}
            className="text-lg md:text-xl"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-lg font-bold">
            Password
          </Label>
          <Input
            type="password"
            id="password"
            placeholder="Enter your Password"
            value={formData.password}
            onChange={onChange}
            className="text-lg md:text-xl"
            disabled={loading}
          />
        </div>

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-red-500 hover:text-red-400"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-4 text-lg font-bold bg-[var(--ring)] hover:bg-green-800 hover:cursor-pointer text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 animate-spin" />
              Logging in Please wait...
            </>
          ) : (
            <>
              <LogIn size={20} className="mr-2" />
              Login
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default Login;

"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { loginUser } from "@/redux/auth-slice";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import Swal from "sweetalert2";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="w-full min-h-[72vh] flex flex-col justify-center items-center px-4">
      <h1 className="text-4xl lg:text-5xl text-center font-extrabold mb-5 md:mb-8">
        Login to your Account
      </h1>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-xl border rounded-xl p-5 md:p-10 flex flex-col gap-4"
      >
        <div>
          <Label htmlFor="email" className="text-lg md:text-xl mb-2 font-bold">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            placeholder="Enter your Email Address"
            value={formData.email}
            onChange={onChange}
            className="text-lg md:text-xl p-5"
            disabled={loading}
          />
        </div>

        <div className="relative">
          <Label
            htmlFor="password"
            className="text-lg md:text-xl mb-2 font-bold"
          >
            Password
          </Label>
          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Enter your Password"
            value={formData.password}
            onChange={onChange}
            className="text-lg md:text-xl p-5 pr-12"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-[75%] hover:cursor-pointer transform -translate-y-1/2"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
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
              <LogIn size={30} className="mr-1" />
              Login
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default Login;

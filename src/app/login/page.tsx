"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      toast.success("Login success");
      router.push("/");
    } catch (error: any) {
      console.log("Login failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="bg-gradient-to-br from-[#A58EFF] via-[#FF7AC2] to-[#BE76CF] min-h-screen flex justify-center items-center">
      <div className="flex flex-col items-center justify-center py-14 px-10 sm:px-16 rounded-3xl shadow-2xl bg-white/80 dark:bg-black/60 border border-[#BE76CF]/20 backdrop-blur-lg transition-all duration-300 max-w-md w-full">
        <h1 className="text-4xl font-extrabold text-[#BE76CF] mb-2 drop-shadow-lg tracking-wide text-center">
          {loading ? "Processing..." : "Login"}
        </h1>
        <hr className="w-16 border-[#BE76CF]/40 mb-8" />
        <div className="w-full">
          <div className="flex flex-col mb-4">
            <label htmlFor="email" className="mb-1 font-semibold text-[#BE76CF]">
              Email
            </label>
            <input
              className="px-4 py-3 rounded-xl border border-[#BE76CF]/30 shadow focus:outline-none focus:ring-2 focus:ring-[#BE76CF] text-lg text-black dark:bg-black/30 dark:text-white transition-all duration-200"
              id="email"
              type="text"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col mb-6">
            <label htmlFor="password" className="mb-1 font-semibold text-[#BE76CF]">
              Password
            </label>
            <input
              className="px-4 py-3 rounded-xl border border-[#BE76CF]/30 shadow focus:outline-none focus:ring-2 focus:ring-[#BE76CF] text-lg text-black dark:bg-black/30 dark:text-white transition-all duration-200"
              id="password"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          <button
            onClick={onLogin}
            disabled={buttonDisabled || loading}
            className={`w-full py-3 rounded-xl bg-gradient-to-r from-[#BE76CF] to-[#FF7AC2] text-white font-bold text-lg shadow-lg hover:scale-105 hover:from-[#A58EFF] hover:to-[#BE76CF] transition-all duration-200 border border-[#BE76CF]/30 mb-4 ${
              buttonDisabled || loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="text-center">
            <Link
              href="/signup"
              className="text-[#BE76CF] hover:underline font-semibold"
            >
              Visit Signup page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

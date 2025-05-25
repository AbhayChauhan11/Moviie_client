"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup success", response.data);
      toast.success("signup success");
      router.push("/profile");
    } catch (error: any) {
      console.log("Signup failed", error.message);

      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className=" bg-gradient-to-r from-[rgb(165,142,255)] to-[#FF7AC2] min-h-screen flex justify-center items-center">
      <div
        className="flex bg-[#BE76CF] shadow-[#a968b8]
        drop-shadow-xl  flex-col items-center justify-center  py-16 px-16 rounded-lg"
      >
        <h1 className="text-[2.5rem] font-bold relative bottom-3 ">
          {loading ? "Processing" : "Signup"}
        </h1>
        <hr />
        <div className="flex flex-col">
          <label htmlFor="username">username</label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="username"
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="username"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email">email</label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="email"
            type="text"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="email"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">password</label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="password"
          />
        </div>
        <div className="flex flex-col relative top-2 ">
          <button
            onClick={onSignup}
            className="p-2 border  border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
          >
            {buttonDisabled ? "No signup" : "Signup"}
          </button>
          <Link href="/login">Visit login page</Link>
        </div>
      </div>
    </div>
  );
}

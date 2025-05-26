"use client"
import React, { useContext, useEffect } from "react";
import MainPage from "@/screen/MainPage";
import { TypeExContext } from "@/context/context";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, setUser } = useContext(TypeExContext);
  const router = useRouter();

  const getData = async () => {
    try {
      const res = await axios.get("/api/users/me");
      setUser(res.data.data);
    } catch (error) {
      // If error, redirect to login
      router.push("/login");
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  if (user) {
    return <MainPage />;
  } else {
    return <div>Loading...</div>;
  }
}

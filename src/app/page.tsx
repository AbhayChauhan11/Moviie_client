"use client"
import React, { useContext, useEffect } from "react";
import MainPage from "@/screen/MainPage";
import { TypeExContext } from "@/context/context";
import axios from "axios";

export default function ProfilePage() {
  const { user, setUser } = useContext(TypeExContext);

  const getData = async () => {
    const res = await axios.get("/api/users/me");

    setUser(res.data.data);
    console.log(user);
  };
  

  useEffect(() => {
    getData();
  });
  if (user) {
    return (<MainPage />)
  } else {
    return <div>Loading</div>;
  }
}

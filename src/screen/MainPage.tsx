import axios from "axios";
import { TypeExContext } from "@/context/context";
import Image from "next/image";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Home from "./home";
type Props = {};

const MainPage = (props: Props) => {
  const router = useRouter();
  const [data, setData] = useState("nothing");
  const { user, setUser, setCreateRoom, setJoinRoom } = useContext(TypeExContext);
 // console.log(user);
  const logout = async () => {
    try {
      // Clear all localStorage for a fresh start
      localStorage.clear();

      // Reset context state if available
      setUser(null);
      setCreateRoom && setCreateRoom(false);
      setJoinRoom && setJoinRoom(false);

      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    console.log(res.data);
    setData(res.data.data._id);

    router.push(`/profile/${data}`);
  };

  function del() {
    localStorage.clear();
  }

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-[#A58EFF] via-[#FF7AC2] to-[#BE76CF] overflow-hidden">
      <div className="backdrop-blur-sm flex-1 flex flex-col">
        <nav className="flex justify-between items-center px-5 py-4 lg:px-10 rounded-b-2xl shadow-2xl bg-white/70 dark:bg-black/40 border-b border-[#BE76CF] mx-2 mt-2"
          style={{
            boxShadow: "0 8px 32px 0 rgba(165,142,255,0.25), 0 1.5px 8px 0 rgba(255,122,194,0.10)"
          }}
        >
          <div className="flex items-center gap-3">
            <Image
              onClick={del}
              src="/moveefy.png"
              alt="img"
              height={60}
              width={60}
              className="rounded-full shadow-lg border-2 border-[#BE76CF] cursor-pointer hover:scale-105 transition-transform duration-200"
            />
            <span className="text-2xl font-extrabold text-[#BE76CF] drop-shadow-lg tracking-wide select-none hidden sm:inline">
              MovieSync
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={logout}
              className="bg-gradient-to-r from-[#BE76CF] to-[#FF7AC2] text-white font-bold py-2 px-5 rounded-xl shadow-lg hover:scale-105 hover:from-[#A58EFF] hover:to-[#BE76CF] transition-all duration-200 border border-[#BE76CF]/30"
            >
              Logout
            </button>
            {/* Profile button is hidden */}
            <button
              onClick={getUserDetails}
              className="hidden"
            >
              <AccountCircleIcon fontSize="large" />
            </button>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-5xl w-full bg-white/80 dark:bg-black/50 rounded-3xl shadow-2xl p-8 backdrop-blur-md border border-[#BE76CF]/20 mt-10">
            <Home />
          </div>
        </div>

        <hr className="my-8 border-[#BE76CF]/30" />
      </div>
    </div>
  );
};

export default MainPage;

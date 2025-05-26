import React, { useState, useContext, useEffect } from "react";
import { TypeExContext } from "@/context/context";
import { useRouter } from "next/navigation";

import axios from "axios";

type Props = {};

function Home({}: Props) {
  const {
    user,
    setUser,
    roomId,
    setRoomId,
    createRoom,
    setCreateRoom,
    setJoinRoom,
    joinRoom,
  } = useContext(TypeExContext);
 
   const router=useRouter();
   
  useEffect(() => {
    if (localStorage.getItem("isCreated") == "true") setCreateRoom(true);
    else if (localStorage.getItem("isJoined") == "true") {setJoinRoom(true);
    
    }
    console.log(localStorage)
  });

   function cr() {
    console.log(user);
    setCreateRoom(true);
  
    localStorage.setItem("isCreated", "true");
 
    console.log(localStorage.getItem("isCreated"),localStorage);
  }

   function jr() {
    setJoinRoom(true);
   
    localStorage.setItem("isJoined", "true");
   
  }

  if (createRoom == false && joinRoom == false)
    return (
      <main className="bg-gradient-to-r from-[rgb(165,142,255)] to-[#FF7AC2] min-h-screen flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg mb-8 tracking-wide">
            Welcome to MovieSync
          </h1>
          <div className="flex gap-10 flex-wrap">
            <div
              onClick={cr}
              className="group bg-white/30 dark:bg-black/30 min-h-[22rem] min-w-[18rem] flex flex-col justify-center items-center border-2 rounded-2xl border-[#CF94DD] hover:border-white shadow-2xl hover:shadow-[0_8px_32px_0_rgba(190,118,207,0.25),0_1.5px_8px_0_rgba(255,122,194,0.10)] cursor-pointer transition-all duration-300 backdrop-blur-lg transform hover:-translate-y-2"
            >
              <span className="text-6xl mb-4 drop-shadow-lg text-[#BE76CF] group-hover:scale-110 transition-transform duration-200">🎬</span>
              <p className="text-2xl font-bold text-[#BE76CF] group-hover:text-white transition-colors duration-200">Create Room</p>
            </div>
            <div
              onClick={jr}
              className="group bg-white/30 dark:bg-black/30 min-h-[22rem] min-w-[18rem] flex flex-col justify-center items-center border-2 rounded-2xl border-[#CF94DD] hover:border-white shadow-2xl hover:shadow-[0_8px_32px_0_rgba(190,118,207,0.25),0_1.5px_8px_0_rgba(255,122,194,0.10)] cursor-pointer transition-all duration-300 backdrop-blur-lg transform hover:-translate-y-2"
            >
              <span className="text-6xl mb-4 drop-shadow-lg text-[#BE76CF] group-hover:scale-110 transition-transform duration-200">👥</span>
              <p className="text-2xl font-bold text-[#BE76CF] group-hover:text-white transition-colors duration-200">Join Room</p>
            </div>
          </div>
        </div>
      </main>
    );
  else if (joinRoom == true && createRoom == false) {
    
     router.push("/room");
  } else if (createRoom == true && joinRoom == false) {
     router.push("/room"); ;
  }
}

export default Home;

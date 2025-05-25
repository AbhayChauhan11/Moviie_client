
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
      <main className="bg-gradient-to-r from-[rgb(165,142,255)] to-[#FF7AC2] h-screen flex flex-col justify-center items-center">
        <div className="flex gap-8">
          <div
            onClick={cr}
            className="bg-[#BE76CF]
     min-h-[25rem] min-w-[20rem] flex justify-center items-center   border-2 rounded-xl border-[#CF94DD] hover:border-white"
          >
            <p>create room</p>
          </div>
          <div
            onClick={jr}
            className="bg-[#BE76CF]
     min-h-[25rem] min-w-[20rem] flex justify-center shadow-md items-center
     border-2 rounded-xl border-[#CF94DD] hover:border-white
     "
          >
            <p>join room</p>
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

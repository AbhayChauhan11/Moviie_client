"use client"
import styles from "@/app/page.module.css";
import { io } from "socket.io-client";
import { useState, useContext, useEffect } from "react";
import ChatPage from "@/components/page";
import { TypeExContext } from "@/context/context";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [userName, setUserName] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [roomId, setroomId] = useState("");
  const [user, setUser] = useState(null);
  const [data, setData] = useState("nothing");
  const [created, setCreated] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  var socket: any;
  socket = io("https://moviie-socket-server.onrender.com");
  const {
    setRoomId,
    createRoom,
    setCreateRoom,
    setJoinRoom,
    joinRoom,
  } = useContext(TypeExContext);

  useEffect(() => {
    console.log(joinRoom,createRoom);
  },[]);

  useEffect(() => {
    details();
    
    if (localStorage.getItem("roomId") != null) {
      console.log(localStorage.getItem("roomId"));
      socket.emit("join_room", roomId);
      setShowSpinner(true);
      setTimeout(() => {
        setShowChat(true);
        setShowSpinner(false);
      }, 4000);
    }
  }, []);

  useEffect(() => {
    // If no roomId and not creating/joining, redirect to main page
    if (
      !localStorage.getItem("roomId") &&
      !createRoom &&
      !joinRoom
    ) {
      router.push("/");
    }
  }, []);

  const router = useRouter();
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const getUserDetails = async () => {
    try {
      const res = await axios.get("/api/users/me");
      console.log(res.data);
      setData(res.data.data._id);
      router.push(`/profile/${res.data.data._id}`);
    } catch (error: any) {
      console.log(error.message);
      toast.error("Failed to get user details");
    }
  };

  const details = async () => {
    try {
      const res = await axios.get("api/users/me");
      setUser(res.data.data);
      console.log(res.data.data.username);
      setUserName(res.data.data.username);
    } catch (error) {
      // If error, redirect to login
      router.push("/login");
    }
  };

  function del() {
    localStorage.clear();
    router.push("/");
    console.log(localStorage);
  }

  const chandleJoin = async () => {
    try {
      if (!roomId.trim()) {
        toast.error("Please enter a Room ID");
        return;
      }
      
      const res: any = await axios.post("/api/users/createRoom", {
        user,
        roomId,
      });
      toast.success("Room created successfully!");
      
      if (userName !== "" && roomId !== "") {
        console.log(userName, "userName", roomId, "roomId");
        localStorage.setItem("roomId", roomId);
        localStorage.setItem("userName", userName);
        socket.emit("join_room", roomId);
        setShowSpinner(true);
        setTimeout(() => {
          setShowChat(true);
          setShowSpinner(false);
        }, 4000);
      } else {
        toast.error("Please fill in Username and Room ID");
      }
    } catch (error) {
      toast.error("Choose another Room ID, room already exists");
      console.log("error", error);
    }
  };

  const jhandleJoin = async () => {
    try {
      if (!roomId.trim()) {
        toast.error("Please enter a Room ID");
        return;
      }
      
      const res: any = await axios.post("/api/users/joinRoom", {
        user,
        roomId,
      });
      toast.success("Joined room successfully!");
      
      if (userName !== "" && roomId !== "") {
        console.log(userName, "userName", roomId, "roomId");
        localStorage.setItem("roomId", roomId);
        localStorage.setItem("userName", userName);
        socket.emit("join_room", roomId);
        setShowSpinner(true);
        setTimeout(() => {
          setShowChat(true);
          setShowSpinner(false);
        }, 4000);
      } else {
        toast.error("Please fill in Username and Room ID");
      }
    } catch (error) {
      toast.error("Room does not exist");
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#A58EFF] via-[#FF7AC2] to-[#BE76CF] min-h-screen flex flex-col items-center justify-center">
      <nav className="flex justify-between items-center px-6 py-4 w-full max-w-5xl mx-auto rounded-b-2xl shadow-2xl bg-white/70 dark:bg-black/40 border-b border-[#BE76CF] mt-4"
        style={{
          boxShadow: "0 8px 32px 0 rgba(165,142,255,0.25), 0 1.5px 8px 0 rgba(255,122,194,0.10)"
        }}
      >
        <Image
          onClick={del}
          src="/moveefy.png"
          alt="Moveefy Logo"
          height={60}
          width={60}
          className="rounded-full shadow-lg border-2 border-[#BE76CF] cursor-pointer hover:scale-105 transition-transform duration-200"
        />
        
        <div className="flex gap-4 items-center">
          {/* User profile section */}
          <div 
            onClick={getUserDetails}
            className="cursor-pointer bg-white/50 dark:bg-black/30 px-4 py-2 rounded-xl hover:bg-white/80 dark:hover:bg-black/50 transition-all duration-200 border border-[#BE76CF]/30"
          >
            <span className="font-medium text-[#BE76CF]">{userName || "User"}</span>
          </div>
          
          <button
            onClick={logout}
            className="bg-gradient-to-r from-[#BE76CF] to-[#FF7AC2] text-white font-bold py-2 px-5 rounded-xl shadow-lg hover:scale-105 hover:from-[#A58EFF] hover:to-[#BE76CF] transition-all duration-200 border border-[#BE76CF]/30"
          >
            Logout
          </button>
        </div>
      </nav>

      <div
        className="flex flex-col items-center justify-center bg-white/80 dark:bg-black/60 shadow-2xl rounded-3xl p-10 mt-12 max-w-md w-full border border-[#BE76CF]/20 backdrop-blur-md transition-all duration-300"
        style={{ display: showChat ? "none" : "" }}
      >
        <h2 className="text-3xl font-extrabold text-[#BE76CF] mb-8 drop-shadow-lg tracking-wide text-center">
          {createRoom ? "Create a Room" : "Join a Room"}
        </h2>
        
        <div className="w-full mb-2">
          <label className="block text-[#BE76CF] font-medium mb-2">Room ID</label>
          <input
            className="w-full mb-6 px-5 py-3 rounded-xl border border-[#BE76CF]/30 shadow focus:outline-none focus:ring-2 focus:ring-[#BE76CF] text-lg text-black dark:bg-black/30 dark:text-white transition-all duration-200"
            type="text"
            placeholder="Enter a unique Room ID"
            onChange={(e) => setroomId(e.target.value)}
            disabled={showSpinner}
          />
        </div>
        
        <button
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#BE76CF] to-[#FF7AC2] text-white font-bold text-lg shadow-lg hover:scale-105 hover:from-[#A58EFF] hover:to-[#BE76CF] transition-all duration-200 border border-[#BE76CF]/30 flex items-center justify-center"
          onClick={createRoom ? chandleJoin : jhandleJoin}
          disabled={showSpinner}
        >
          {!showSpinner ? (
            createRoom ? (
              "Create Room"
            ) : (
              "Join Room"
            )
          ) : (
            <div className={styles.loading_spinner}></div>
          )}
        </button>
        
        <p className="mt-4 text-[#BE76CF]/80 text-center">
          {createRoom 
            ? "Create a unique room to watch videos with friends" 
            : "Enter an existing Room ID to join your friends"}
        </p>
      </div>

      <div style={{ display: !showChat ? "none" : "" }} className="w-full">
        <ChatPage socket={socket} roomId={roomId} username={userName} />
      </div>
    </div>
  );
}
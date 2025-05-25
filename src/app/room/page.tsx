"use client"
import styles from "@/app/page.module.css";
import { io } from "socket.io-client";
import { useState, useContext, useEffect } from "react";
import ChatPage from "@/components/page";
import { TypeExContext } from "@/context/context";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
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

  var socket: any;
  socket = io("https://moveefy.onrender.com");
  const {
   
    setRoomId,
    createRoom,
    setCreateRoom,
    setJoinRoom,
    joinRoom,
  } = useContext(TypeExContext);

  useEffect(() => {
    
    console.log(joinRoom,createRoom);
   // alert(joinRoom+" "+createRoom);
  },[]);

  useEffect(() => {
    details();
    
    if (localStorage.getItem("roomId") != null) {
      console.log(localStorage.getItem("roomId"));
      socket.emit("join_room", roomId);
      setShowSpinner(true);
      // You can remove this setTimeout and add your own logic
      setTimeout(() => {
        setShowChat(true);
        setShowSpinner(false);
      }, 4000);
    }
  }, []);

  const router = useRouter();
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/");
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

  const details = async () => {
    const res = await axios.get("api/users/me");
    setUser(res.data.data);
    console.log(res.data.data.username);
    setUserName(res.data.data.username);
  };

  function del() {
    localStorage.clear();
    router.push("/");
    console.log(localStorage);
    // window.location.reload();
  }

  // localStorage.clear();
  const chandleJoin = async () => {
    try {
      const res: any = await axios.post("/api/users/createRoom", {
        user,
        roomId,
      });
      toast(res);
      if (userName !== "" && roomId !== "") {
        console.log(userName, "userName", roomId, "roomId");
        localStorage.setItem("roomId", roomId);
        localStorage.setItem("userName", userName);
        socket.emit("join_room", roomId);
        setShowSpinner(true);
        // You can remove this setTimeout and add your own logic
        setTimeout(() => {
          setShowChat(true);
          setShowSpinner(false);
        }, 4000);
      } else {
        alert("Please fill in Username and Room Id");
      }
    } catch (error) {
      alert("choose another roomId,room already exist");
      console.log("error", error);
    }
  };

  const jhandleJoin = async () => {
    try {
      const res: any = await axios.post("/api/users/joinRoom", {
        user,
        roomId,
      });
      toast(res);
      if (userName !== "" && roomId !== "") {
        console.log(userName, "userName", roomId, "roomId");
        localStorage.setItem("roomId", roomId);
        localStorage.setItem("userName", userName);
        socket.emit("join_room", roomId);
        setShowSpinner(true);
        // You can remove this setTimeout and add your own logic
        setTimeout(() => {
          setShowChat(true);
          setShowSpinner(false);
        }, 4000);
      } else {
        alert("Please fill in Username and Room Id");
      }
    } catch (error) {
      alert("Room not exist, press Moveefy icon to go back");
    }
  };

  return (
    <div className="bg-gradient-to-r from-[rgb(165,142,255)] to-[#FF7AC2] min-h-screen  flex justify-center flex-col items-center">
      <nav className="flex justify-between  items-center px-5 py-2 lg:px-6 self-start w-full mb-auto">
        <Image
          onClick={()=>del()}
          src="/moveefy.png"
          alt="img"
          height={60}
          width={60}
        />

        <div className="flex gap-3">
          <button
            onClick={logout}
            className="bg-white 
             hover:text-white
             hover:bg-[#BE76CF]
            text-[#BE76CF] font-bold py-1 px-3  rounded-lg"
          >
            Logout
          </button>

          <button
            onClick={getUserDetails}
            className="text-white hover:text-[#a837c1]
             "
          >
            <AccountCircleIcon fontSize="large" />
          </button>
        </div>
      </nav>

      <div
        className={`${styles.main_div} flex bg-[#BE76CF] shadow-[#a968b8] mb-auto
        drop-shadow-xl  flex-col items-center justify-center  py-16 px-16 rounded-lg`}
        style={{ display: showChat ? "none" : "" }}
      >
        <input
          className={`${styles.main_input} text-black`}
          type="text"
          placeholder="room id"
          onChange={(e) => setroomId(e.target.value)}
          disabled={showSpinner}
        />
        <button
          className={styles.main_button}
          onClick={createRoom == true ? chandleJoin : jhandleJoin}
        >
          {!showSpinner ? (
            createRoom == true ? (
              "create"
            ) : (
              "join"
            )
          ) : (
            <div className={styles.loading_spinner}></div>
          )}
        </button>
      </div>
      <div style={{ display: !showChat ? "none" : "" }}>
        <ChatPage socket={socket} roomId={roomId} username={userName} />
      </div>
    </div>
  );
}

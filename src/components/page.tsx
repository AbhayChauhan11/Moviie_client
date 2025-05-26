"use client"
import React, { useEffect, useState, useRef, useContext } from "react";
import style from "./chat.module.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import { TypeExContext } from "@/context/context"; // <-- Add this import
interface IMsgDataTypes {
  roomId: string | number;
  user: string;
  msg: string;
  time: string;
}

const ChatPage = ({ socket, username, roomId }: any) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [video, setVideo] = useState(false);
  const [user, setUser] = useState({
    username: null,
  });
  const { setCreateRoom, setJoinRoom } = useContext(TypeExContext); // <-- Add this line

  const details = async () => {
    try{
      const res = await axios.get("api/users/me");
      setUser(res.data.data);
     // console.log(user);
      if (roomId.length == 0) {
        localStorage.clear();
      }
    }
    catch(error)
    {
      router.push("login");
    }
    
  //  console.log(roomId);
  };

  useEffect(() => {
    details();
    if (roomId.length == 0 ) {
      localStorage.clear();
    }
   // console.log(roomId);
  
  });

  const router = useRouter();
  const getFormattedTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const getTargetedTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = (now.getSeconds() + 2).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const handlePlay = async () => {
    const msgData: IMsgDataTypes = {
      roomId,
      user: username,
      msg: "play",
      time: getTargetedTime(),
    };

    await socket.emit("send_msg", msgData);

    // Wait for the correct time before playing
    await validateTime(msgData.time);

    if (videoRef.current && !isPlaying) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = async () => {
    const msgData: IMsgDataTypes = {
      roomId,
      user: username,
      msg: "pause",
      time: getTargetedTime(),
    };

    await socket.emit("send_msg", msgData);

    // Wait for the correct time before pausing
    await validateTime(msgData.time);

    if (videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSync = async (a: any) => {
    const msgData: IMsgDataTypes = {
      roomId,
      user: username,
      msg: a,
      time: getTargetedTime(), // Use the current time for synchronization
    };

    await socket.emit("send_msg", msgData);

    // Wait for the correct time before syncing
    await validateTime(msgData.time);
    if (videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }

    // You can add additional logic here if needed
  };

  useEffect(() => {
    socket.on("receive_msg", async (data: IMsgDataTypes) => {
      if (data.msg === "play" && videoRef.current) {
        // Wait for the correct time before playing
        await validateTime(data.time);

        videoRef.current.play();
        setIsPlaying(true);
      } else if (data.msg === "pause" && videoRef.current) {
        // Wait for the correct time before pausing
        await validateTime(data.time);

        videoRef.current.pause();
        setIsPlaying(false);
      } else if (data.msg === "plus" && videoRef.current) {
        // Wait for the correct time before adjusting
        await validateTime(data.time);

        videoRef.current.currentTime += 10;
      } else if (data.msg === "minus" && videoRef.current) {
        // Wait for the correct time before adjusting
        await validateTime(data.time);

        videoRef.current.currentTime -= 10;
      } else {
        // Wait for the correct time before syncing
        await validateTime(data.time);
        if (videoRef.current)
          videoRef.current.currentTime = parseFloat(data.msg);
        // You can add additional logic here if needed
      }
    });
  }, [socket]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: any = e.target.files?.[0];
    setSelectedVideo(file);
    setVideo(true);
    // Reset video player
    if (videoRef.current) {
      videoRef.current.load();
      setIsPlaying(false);
    }
  };

  const handleIncreaseTime = async () => {
    const msgData: IMsgDataTypes = {
      roomId,
      user: username,
      msg: "plus",
      time: getFormattedTime(),
    };

    await socket.emit("send_msg", msgData);

    // Wait for the correct time before adjusting
    await validateTime(msgData.time);

    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const handleDecreaseTime = async () => {
    const msgData: IMsgDataTypes = {
      roomId,
      user: username,
      msg: "minus",
      time: getFormattedTime(),
    };

    await socket.emit("send_msg", msgData);

    // Wait for the correct time before adjusting
    await validateTime(msgData.time);

    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  const exit = async () => {
    try {
      console.log(roomId);
      const res = await axios.post("api/users/leaveRoom", roomId);
      console.log(res);
      localStorage.clear();
      setCreateRoom(false); // Reset context state
      setJoinRoom(false);   // Reset context state
    } catch (error) {
      alert(error);
    } finally {
      router.push("/");
    }
  };
  const validateTime: any = (targetTime: any) => {
    return new Promise((resolve: any) => {
      const checkTime = () => {
        const currentTime = getFormattedTime();
        if (currentTime === targetTime) {
          resolve(); // Resolve without passing a value
        } else {
          setTimeout(checkTime, 1000);
        }
      };

      checkTime();
    });
  };

  return (
    <div
      className={`${style.chat_div} bg-gradient-to-r from-[rgb(165,142,255)] to-[#FF7AC2] min-h-fit w-full flex justify-center items-center py-8`}
    >
      <div className="w-full max-w-3xl mx-auto shadow-soft rounded-xl bg-white/80 dark:bg-black/60 p-6">
        <div className="flex items-center justify-center aspect-w-16 aspect-h-9 relative">
          {selectedVideo && (
            <video
              ref={videoRef}
              className="object-contain w-full max-h-[50vh] rounded-lg border-theme bg-black"
              controls
            >
              {selectedVideo && (
                <source
                  src={URL.createObjectURL(selectedVideo)}
                  type="video/mp4"
                />
              )}
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <div className="mt-6 flex justify-center" style={{ display: video ? "none" : "" }}>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="py-2 px-4 border-theme rounded-lg shadow-sm bg-white/90 dark:bg-black/40 text-sm"
          />
        </div>
        <div>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePlay}
              className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition"
            >
              ▶ Play
            </button>
            <button
              onClick={handlePause}
              className="px-5 py-2 font-semibold text-white bg-blue-400 hover:bg-blue-500 rounded-lg shadow transition"
            >
              ❚❚ Pause
            </button>
            <button
              onClick={handleIncreaseTime}
              className="px-5 py-2 font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg shadow transition"
            >
              +10s
            </button>
            <button
              onClick={handleDecreaseTime}
              className="px-5 py-2 font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow transition"
            >
              -10s
            </button>
            <button
              onClick={() => handleSync(videoRef.current?.currentTime)}
              className="px-5 py-2 font-semibold text-white bg-purple-500 hover:bg-purple-600 rounded-lg shadow transition"
            >
              ⟳ Sync
            </button>
          </div>
          <div className="flex items-center justify-center mt-6">
            <button
              onClick={exit}
              className="px-6 py-2 font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow transition"
            >
              Leave Room
            </button>
          </div>
          <div className="fixed bottom-4 right-4 bg-white/80 dark:bg-black/60 rounded-lg px-4 py-2 shadow-soft text-sm border-theme">
            <p className="font-semibold">Room ID: <span className="font-normal">{roomId}</span></p>
            <p className="font-semibold">User: <span className="font-normal">{user.username}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

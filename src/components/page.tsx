"use client"
import React, { useEffect, useState, useRef } from "react";
import style from "./chat.module.css";
import { useRouter } from "next/navigation";
import axios from "axios";
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
    
    } catch (error) {
      alert(error);
    }
    finally{
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
      className={`${style.chat_div} bg-gradient-to-r from-[rgb(165,142,255)] to-[#FF7AC2] min-h-fit w-[80vw] flex justify-center items-center`}
    >
      <div className="max-w-screen mx-auto shadow-lg rounded-md max-h-[70vh] ">
        <div className="flex items-center justify-center aspect-w-16 aspect-h-9">
          {selectedVideo && (
            <video
              ref={videoRef}
              className="object-cover w-[70%] h-[60%] absolute "
              controls
            >
              {selectedVideo && (
                <source
                  src={URL.createObjectURL(selectedVideo)}
                  className="w-[80vw] "
                  type="video/mp4"
                />
              )}
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <div className="mt-4" style={{ display: video ? "none" : "" }}>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="py-2 px-4 border rounded-md"
          />
        </div>
        <div>
          <div className="flex items-center justify-center mt-4 space-x-4 relative sm:top-[32vw]  lg:top-[16vw]">
            <button
              onClick={handlePlay}
              className="px-4 py-2 text-white bg-blue-500 rounded-md"
            >
              Play
            </button>
            <button
              onClick={handlePause}
              className="px-4 py-2 text-white bg-blue-500 rounded-md"
            >
              Pause
            </button>
            <button
              onClick={handleIncreaseTime}
              className="px-4 py-2 text-white bg-green-500 rounded-md"
            >
              +10s
            </button>
            <button
              onClick={handleDecreaseTime}
              className="px-4 py-2 text-white bg-red-500 rounded-md"
            >
              -10s
            </button>
            <button
              onClick={() => handleSync(videoRef.current?.currentTime)}
              className="px-4 py-2 text-white bg-purple-500 rounded-md"
            >
              Sync
            </button>
          </div>
          <div className="flex items-center justify-center mt-4 space-x-4 relative sm:top-[32vw]  lg:top-[16vw]">
            <button
              onClick={exit}
              className="px-4  py-2 text-white bg-red-600 rounded-md"
            >
              Leave
            </button>
          </div>
          <div className="fixed bottom-0 right-0">
            <p> RoomId: {roomId}</p>
            <p> UserName: {user.username}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

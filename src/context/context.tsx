"use client"
import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

type ContainerProps = {
  children: ReactNode;
}

type TypeExContextType = {
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
  roomId: any;
  setRoomId: Dispatch<SetStateAction<any>>;
  createRoom: boolean;
  setCreateRoom: Dispatch<SetStateAction<any>>;
  joinRoom: boolean;
  setJoinRoom: Dispatch<SetStateAction<any>>;
}


const typeExContextState: TypeExContextType = {
  user: null,
  setUser: () => {},
  roomId: null, // Set the initial value to null or another suitable default
  setRoomId: () => {},
  createRoom: false, // Set the initial value to false or another suitable default
  setCreateRoom: () => {},
  joinRoom: false,
  setJoinRoom: () => {},
}

const TypeExContext = createContext<TypeExContextType>(typeExContextState);

const TypeExProvider = (props: ContainerProps) => {
  const [user, setUser] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [createRoom, setCreateRoom] = useState(false);
  const [joinRoom,setJoinRoom]=useState(false);
  

  return (
    <TypeExContext.Provider value={{ user, setUser, roomId, setRoomId, createRoom, setCreateRoom,setJoinRoom, joinRoom }}>
      {props.children}
    </TypeExContext.Provider>
  );
};

export { TypeExContext, TypeExProvider };

import { connect } from "@/dbConfig/dbConfig";
import Room from "@/models/roomModels";
import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { user, roomId } = reqBody;

    // Basic validation
    if (!user || !roomId) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    console.log("create Room", reqBody, user, roomId);
    let room = await Room.findOne({ roomId });
    
    console.log(room);

    if (room!=null) {
      console.log("er")
      return NextResponse.json({ error: "Room already exists" }, { status: 400 });
    }
    const username=user.username;
    const newRoom = new Room({
      roomId:roomId,
      createdBy:username 
    });

    console.log(newRoom);

    try {
      const savedRoom = await newRoom.save();
      console.log("savedRoom", savedRoom);
    } catch (error) {
      console.error("Error saving room:", error);
      return NextResponse.json({ error: "Error saving room" }, { status: 500 });
    }
    
    return NextResponse.json({
      message: "Room created successfully",
      success: true,
      // savedRoom,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

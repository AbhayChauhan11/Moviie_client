import {connect} from "@/dbConfig/dbConfig";
import Room from "@/models/roomModels";
import { NextRequest, NextResponse } from "next/server";

connect();
export async function POST(request: NextRequest){
try {
  
  const reqBody = await request.json();
  const roomId=reqBody;
  console.log(roomId);
  const room1=await Room.findOne({roomId});
  console.log(room1);
  if( room1==null) 
  {return NextResponse.json({error:"User or RoomId is not present"},
{
  status:400
})}

console.log(" room exists");

await Room.deleteOne(room1);

return NextResponse.json({ message: "Room deleted successfully" }, { status: 200 });

  
} catch (error:any) {
  
  return NextResponse.json({error: error.message}, {status: 500})

}


}
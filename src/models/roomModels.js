import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomId: { type: Number, required: true, unique: true },

  createdBy: {
    type: String,
  },
  joinedBy: {
    type: String,
  },

  Player1: {
    type: Boolean,
  },
  Player2: {
    type: Boolean,
  },
});

const Room = mongoose.models.rooms || mongoose.model("rooms", roomSchema);

export default Room;

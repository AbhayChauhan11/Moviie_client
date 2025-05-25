import mongoose from "mongoose"

const countSchema= new mongoose.Schema({
   name:  { type: Number, required: true ,unique:true }
});

const Count = mongoose.models.counts || mongoose.model("counts", countSchema);

export default Count;

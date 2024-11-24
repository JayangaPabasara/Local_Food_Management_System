import mongoose from "mongoose";

export const connectDB = async ()=>{
    await mongoose.connect('dbURL')
    .then(()=>console.log("DB Connected"))
}
import mongoose from "mongoose";

export const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv://jayangapabasara71:rzBz8tKYNAvJ2ufz@cluster0.vwmic.mongodb.net/local-food')
    .then(()=>console.log("DB Connected"))
}
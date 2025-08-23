import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        mongoose.connection.on('connected', () => console.log("เชื่อมต่อสำเร็จ"));

        await mongoose.connect(`${process.env.MONGODB_URI}/car`)
    } catch (error) {
        console.log(error.message);
    }
}

export default connectDB;
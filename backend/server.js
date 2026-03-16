import express from 'express';
import { config } from 'dotenv';
import { connect } from 'mongoose';

config();
const app = express();

const connectDB = async()=>{
    try {
        await connect(process.env.MONGO_URL);
        console.log("database connected sucessfully");

        app.listen(process.env.PORT, ()=>{
            console.log(`server is running on port ${process.env.PORT}`);
        })

    } catch(err) {
        console.log(err);
    }
}

connectDB();
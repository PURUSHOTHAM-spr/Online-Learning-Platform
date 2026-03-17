import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { connect } from 'mongoose';
import cookieParser from 'cookie-parser';
import { userRouter } from './APIs/userAPI.js';
import { instructorRouter } from './APIs/instructorAPI.js';
import { authRouter } from './APIs/commonAPI.js';
import { adminRouter } from './APIs/adminAPI.js';

config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl) or any localhost port in dev
        if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use('/user-api', userRouter);
app.use('/instructor-api', instructorRouter);
app.use('/common-api', authRouter);
app.use('/admin-api', adminRouter);

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
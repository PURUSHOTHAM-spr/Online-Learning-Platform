import express from "express";
import { User } from "../models/User.js";

export const userRouter = express.Router();

userRouter.get('/hello', (req, res)=>{
    res.send("hello")
});

userRouter.post('/register', async(req, res)=>{
    let user = req.body;
    res.send(user);
});
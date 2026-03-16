import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "first name is required"]
    },
    lastName: {
        type: String,
        required: [true, "last name is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true
    },
    password: {
        type: String,
        minLength: 6,
        required: [true, "password is required"]
    },
    role: {
        type: String,
        enum: ["STUDENT", "INSTRUCTURE", "ADMIN"],
        required: [true, "role is required"]
    },
    profilePic: {
        type: String
    },
    coursesEnrolled: {
        
    }

})
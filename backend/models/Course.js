import mongoose from "mongoose";

const contentSchema = mongoose.Schema({
    video: {
        title: {
            type: String,
            required: [true, "title is required"]
        },
        description: {
            type: String,
            required: [true, "description is required"]
        },
        url: {
            type: String,
            required: [true, "url is required"]
        }
    }
})

const userCommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: {
        type: String
    }
},{
    versionKey: false
})

const courseSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "title is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    courseOutcomes: {
        type: Array,
        default: []
    },
    category: {
        type: String,
        required: [true, "category is required"]
    },
    content: {
        type: [contentSchema],
        default: []
    },
    studentsEnrolled: {
        type: Number,
        default: 0
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    rating: {
        type: Number,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    courseLevel: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        required: [true, "course level is required"]
    },
    comments: {
        type: [userCommentSchema],
        default: []
    }
})

export const Course = mongoose.model('Course', courseSchema);
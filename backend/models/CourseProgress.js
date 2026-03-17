import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    completedLectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course.sections.lectures" // Logical reference to the sub-document
    }],
    lastAccessed: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true,
    versionKey: false 
});

// Ensure a user can only have one progress record per course
courseProgressSchema.index({ user: 1, course: 1 }, { unique: true });

export const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);

import mongoose from "mongoose";



// Lecture or content Schema

const lectureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    videoUrl: {
        type: String,
        required: true
    },
    duration: {
        type: String
    },
    isPreview: {
        type: Boolean,
        default: false
    }
});



// Section Schema

const sectionSchema = new mongoose.Schema({
    sectionTitle: {
        type: String,
        required: true
    },
    lectures: {
        type: [lectureSchema],
        default: []
    }
});



// Comment Schema

const userCommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comment: String
},{
    versionKey: false
});



// Review Schema

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true,
    versionKey: false
});


// Course Schema

const courseSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "title is required"]
    },

    description: {
        type: String,
        required: [true, "Description is required"]
    },

    category: {
        type: String,
        required: [true, "category is required"]
    },

    courseLevel: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        required: [true, "course level is required"]
    },

    price: {
        type: Number,
        default: 0
    },

    courseOutcomes: {
        type: [String],
        default: []
    },

    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    studentsEnrolled: {
        type: Number,
        default: 0
    },

    rating: {
        type: Number,
        default: 0
    },

    ratingCount: {
        type: Number,
        default: 0
    },

    sections: {
        type: [sectionSchema],
        default: []
    },

    isActive: {
        type: Boolean,
        default: true
    },

    thumbnail: {
        type: String,
        default: ""
    },

    comments: {
        type: [userCommentSchema],
        default: []
    },

    reviews: {
        type: [reviewSchema],
        default: []
    }

}, { timestamps: true });


export const Course = mongoose.model("Course", courseSchema);
import mongoose from 'mongoose';
import { User } from './models/User.js';
import { Course } from './models/Course.js';
import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 4 free sample MP4 video URLs (hosted publicly, no download needed)
const SAMPLE_VIDEOS = [
    { url: 'https://www.w3schools.com/html/mov_bbb.mp4',     title: 'Introduction to the Course',         description: 'Welcome and overview of what you will learn.' },
    { url: 'https://www.w3schools.com/html/movie.mp4',       title: 'Core Concepts Explained',            description: 'Deep dive into core concepts of the subject.' },
    { url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4', title: 'Hands-On Practice',            description: 'Follow along with practical exercises.' },
    { url: 'https://samplelib.com/lib/preview/mp4/sample-10s.mp4', title: 'Final Project Walkthrough',   description: 'Build the final project step by step.' }
];

const SECTIONS = [
    'Getting Started',
    'Core Concepts',
    'Practical Application',
    'Final Project'
];

const INSTRUCTOR_ID = '69b8281304d0673be568a1fc';

const run = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect('mongodb://localhost:27017/online-learning-platform');

        const instructor = await User.findById(INSTRUCTOR_ID);
        if (!instructor) {
            console.error('Instructor not found!');
            process.exit(1);
        }

        console.log(`Found instructor: ${instructor.firstName} ${instructor.lastName}`);

        // Upload 4 videos to Cloudinary (using public URLs — no local file needed)
        console.log('\nUploading 4 videos to Cloudinary...');
        const uploadedVideos = [];
        for (let i = 0; i < SAMPLE_VIDEOS.length; i++) {
            const v = SAMPLE_VIDEOS[i];
            console.log(`  [${i + 1}/4] Uploading "${v.title}" from ${v.url} ...`);
            try {
                const result = await cloudinary.uploader.upload(v.url, {
                    resource_type: 'video',
                    folder: 'online-learning-platform'
                });
                console.log(`       ✅ Done: ${result.secure_url}`);
                uploadedVideos.push({
                    ...v,
                    videoUrl: result.secure_url,
                    duration: result.duration ? result.duration.toString() : '0'
                });
            } catch (err) {
                console.error(`       ❌ Failed: ${err.message}`);
                // Fallback to a known working cloudinary demo video
                const fallback = await cloudinary.uploader.upload('https://res.cloudinary.com/demo/video/upload/dog.mp4', {
                    resource_type: 'video',
                    folder: 'online-learning-platform'
                });
                console.log(`       ✅ Fallback uploaded: ${fallback.secure_url}`);
                uploadedVideos.push({
                    ...v,
                    videoUrl: fallback.secure_url,
                    duration: fallback.duration ? fallback.duration.toString() : '0'
                });
            }
        }

        // Build 4 sections, each with one lecture
        const sections = SECTIONS.map((sectionTitle, i) => ({
            sectionTitle,
            lectures: [{
                title: uploadedVideos[i].title,
                description: uploadedVideos[i].description,
                videoUrl: uploadedVideos[i].videoUrl,
                duration: uploadedVideos[i].duration,
                isPreview: i === 0  // First lecture is free preview
            }]
        }));

        console.log('\nCreating course in MongoDB...');
        const course = await Course.create({
            title:         'Complete Web Development Bootcamp',
            description:   'Learn web development from absolute scratch to advanced level. Covers HTML, CSS, JavaScript, Node.js, and MongoDB with real-world projects.',
            category:      'Web Development',
            courseLevel:   'Beginner',
            courseOutcomes: [
                'Build real-world web applications from scratch',
                'Master HTML, CSS and JavaScript fundamentals',
                'Learn backend development with Node.js and Express',
                'Work with MongoDB and Mongoose for data storage'
            ],
            instructor: INSTRUCTOR_ID,
            sections
        });

        console.log('\n✅ Course created successfully!');
        console.log('   Course ID :', course._id);
        console.log('   Title     :', course.title);
        console.log('   Sections  :');
        course.sections.forEach((s, i) => {
            console.log(`     [${i + 1}] ${s.sectionTitle}`);
            s.lectures.forEach(l => console.log(`          └─ ${l.title} | ${l.videoUrl}`));
        });

        mongoose.disconnect();

    } catch (err) {
        console.error('\n❌ Script failed:', err.message);
        mongoose.disconnect();
        process.exit(1);
    }
};

run();

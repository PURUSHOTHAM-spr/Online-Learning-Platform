/**
 * patchVideoUrls.js
 * One-shot migration: replaces all broken Google GTV video URLs
 * in existing DB records with working public sample MP4 URLs.
 *
 * Run with:  node patchVideoUrls.js
 */

import mongoose from "mongoose";
import { config } from "dotenv";
import { Course } from "./models/Course.js";

config();

// Broken prefix to detect
const BROKEN_PREFIX = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/";

// Working replacement URLs (round-robin cycling)
const WORKING_VIDEOS = [
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
  "https://www.w3schools.com/html/movie.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
  "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
];

let urlIdx = 0;
const nextUrl = () => WORKING_VIDEOS[urlIdx++ % WORKING_VIDEOS.length];

async function patch() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("✅ Connected to MongoDB");

  const courses = await Course.find({});
  let totalPatched = 0;
  let coursesPatched = 0;

  for (const course of courses) {
    let modified = false;

    for (const section of course.sections) {
      for (const lecture of section.lectures) {
        if (lecture.videoUrl && lecture.videoUrl.startsWith(BROKEN_PREFIX)) {
          const replacement = nextUrl();
          console.log(`  🔧 [${course.title}] "${lecture.title}"`);
          console.log(`     OLD: ${lecture.videoUrl}`);
          console.log(`     NEW: ${replacement}`);
          lecture.videoUrl = replacement;
          modified = true;
          totalPatched++;
        }
      }
    }

    if (modified) {
      await course.save();
      coursesPatched++;
      console.log(`  ✅ Saved course: "${course.title}"\n`);
    }
  }

  if (totalPatched === 0) {
    console.log("ℹ️  No broken video URLs found — database is already clean.");
  } else {
    console.log(`\n🎉 Patch complete! Fixed ${totalPatched} lecture(s) across ${coursesPatched} course(s).`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

patch().catch(err => {
  console.error("❌ Patch failed:", err);
  process.exit(1);
});

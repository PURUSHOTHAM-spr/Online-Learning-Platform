const userdata = [
  {
    "firstName": "Abhinav",
    "lastName": "Chowdary",
    "email": "abhinav.dev@example.com",
    "password": "password123",
    "role": "STUDENT",
    "coursesEnrolled": []
  },
  {
    "firstName": "Rahul",
    "lastName": "Sharma",
    "email": "rahul.sharma@example.com",
    "password": "password123",
    "role": "STUDENT",
    "coursesEnrolled": []
  },
  {
    "firstName": "Priya",
    "lastName": "Reddy",
    "email": "priya.reddy@example.com",
    "password": "password123",
    "role": "STUDENT",
    "coursesEnrolled": []
  },
  {
    "firstName": "Vikram",
    "lastName": "Naidu",
    "email": "vikram.naidu@example.com",
    "password": "password123",
    "role": "INSTRUCTURE",
    "coursesEnrolled": []   
  },
  {
    "firstName": "Ananya",
    "lastName": "Iyer",
    "email": "ananya.iyer@example.com",
    "password": "password123",
    "role": "INSTRUCTURE",
    "coursesEnrolled": []
  },
  {
    "firstName": "System",
    "lastName": "Admin",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "ADMIN",
    "coursesEnrolled": []
  }
]


const courseData = [
  {
    "title": "Complete React Developer Bootcamp",
    "description": "Learn React from scratch including hooks, state management, and real-world projects.",
    "courseOutcomes": [
      "Build modern React applications",
      "Understand React Hooks",
      "State management with Context API",
      "Deploy React apps"
    ],
    "category": "Web Development",
    "courseLevel": "Beginner",
    "instructor": "69b7b94e34f5d86d5ebd7f85",
    "content": [
      {
        "video": {
          "title": "Introduction to React",
          "description": "Overview of React and why it is used.",
          "url": "https://example.com/react-intro.mp4"
        }
      },
      {
        "video": {
          "title": "Understanding JSX",
          "description": "Learn how JSX works in React.",
          "url": "https://example.com/react-jsx.mp4"
        }
      }
    ],
    "comments": [
      {
        "user": "65f1a2c3b9d1e23456789011",
        "comment": "Very beginner friendly course!"
      },
      {
        "user": "65f1a2c3b9d1e23456789012",
        "comment": "Loved the explanation of hooks."
      }
    ]
  },
  {
    "title": "Node.js and Express Masterclass",
    "description": "Build scalable backend applications using Node.js and Express.",
    "courseOutcomes": [
      "Create REST APIs",
      "Authentication with JWT",
      "Connect MongoDB",
      "Error handling"
    ],
    "category": "Backend Development",
    "courseLevel": "Intermediate",
    "studentsEnrolled": 85,
    "instructor": "65f1a2c3b9d1e23456789002",
    "rating": 4.4,
    "ratingCount": 60,
    "content": [
      {
        "video": {
          "title": "Node.js Fundamentals",
          "description": "Understanding Node.js architecture.",
          "url": "https://example.com/node-intro.mp4"
        }
      },
      {
        "video": {
          "title": "Building REST APIs",
          "description": "Creating RESTful APIs with Express.",
          "url": "https://example.com/express-api.mp4"
        }
      }
    ],
    "comments": [
      {
        "user": "65f1a2c3b9d1e23456789013",
        "comment": "API explanation was really good."
      }
    ]
  },
  {
    "title": "Advanced MongoDB for Developers",
    "description": "Deep dive into MongoDB aggregation, indexing, and performance tuning.",
    "courseOutcomes": [
      "Aggregation pipelines",
      "Database indexing",
      "Performance optimization",
      "Schema design"
    ],
    "category": "Database",
    "courseLevel": "Advanced",
    "studentsEnrolled": 45,
    "instructor": "65f1a2c3b9d1e23456789003",
    "rating": 4.7,
    "ratingCount": 40,
    "content": [
      {
        "video": {
          "title": "MongoDB Aggregation",
          "description": "Learn aggregation pipelines.",
          "url": "https://example.com/mongo-aggregation.mp4"
        },
        "video": {
          "title": "Indexing in MongoDB",
          "description": "Improve query performance with indexing.",
          "url": "https://example.com/mongo-indexing.mp4"
        }
      }
    ],
    "comments": []
  }
]
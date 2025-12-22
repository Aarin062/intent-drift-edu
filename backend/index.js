const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
app.use(express.json());

const prisma = new PrismaClient();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Intent Drift Backend is running 🚀");
});

app.get("/test-db", async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: `test${Date.now()}@example.com`,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "DB error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.post("/courses", async (req, res) => {
  try {
    const { title, description } = req.body;

    const course = await prisma.course.create({
      data: {
        title,
        description,
      },
    });

    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create course" });
  }
});

app.post("/lessons", async (req, res) => {
  try {
    const { title, contentLength, difficultyLevel, courseId } = req.body;

    const lesson = await prisma.lesson.create({
      data: {
        title,
        contentLength,
        difficultyLevel,
        courseId,
      },
    });

    res.status(201).json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create lesson" });
  }
});

app.post("/activity", async (req, res) => {
  try {
    const { userId, lessonId, timeSpent, completed } = req.body;

    const activity = await prisma.lessonActivity.create({
      data: {
        userId,
        lessonId,
        timeSpent,
        completed,
      },
    });

    res.status(201).json(activity);
  } catch (error) {
    console.error("ACTIVITY LOG ERROR:", error);
    res.status(500).json({ error: "Failed to log activity" });
  }
});

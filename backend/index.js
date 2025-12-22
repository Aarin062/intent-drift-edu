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

app.get("/metrics/engagement/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const activities = await prisma.lessonActivity.findMany({
      where: { userId },
      include: {
        lesson: true,
      },
    });

    const results = activities.map((a) => {
      const expectedTime = a.lesson.contentLength * 60;
      const engagementDepth = a.timeSpent / expectedTime;

      return {
        lessonId: a.lessonId,
        timeSpent: a.timeSpent,
        expectedTime,
        engagementDepth: Number(engagementDepth.toFixed(2)),
        completed: a.completed,
        timestamp: a.timestamp,
      };
    });

    res.json(results);
  } catch (error) {
    console.error("ENGAGEMENT METRIC ERROR:", error);
    res.status(500).json({ error: "Failed to compute engagement metric" });
  }
});

app.get("/metrics/completion-consistency/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const activities = await prisma.lessonActivity.findMany({
      where: { userId },
      include: { lesson: true },
    });

    const results = activities.map((a) => {
      const expectedTime = a.lesson.contentLength * 60;
      const engagementDepth = a.timeSpent / expectedTime;

      const inconsistentCompletion =
        a.completed === true && engagementDepth < 0.4;

      return {
        lessonId: a.lessonId,
        completed: a.completed,
        engagementDepth: Number(engagementDepth.toFixed(2)),
        inconsistentCompletion,
        timestamp: a.timestamp,
      };
    });

    res.json(results);
  } catch (error) {
    console.error("COMPLETION CONSISTENCY ERROR:", error);
    res.status(500).json({ error: "Failed to compute completion consistency" });
  }
});

app.get("/metrics/revisit-rate/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const activities = await prisma.lessonActivity.findMany({
      where: { userId },
    });

    const revisitMap = {};

    activities.forEach((activity) => {
      revisitMap[activity.lessonId] =
        (revisitMap[activity.lessonId] || 0) + 1;
    });

    const result = Object.keys(revisitMap).map((lessonId) => ({
      lessonId: Number(lessonId),
      visitCount: revisitMap[lessonId],
    }));

    res.json(result);
  } catch (error) {
    console.error("REVISIT RATE ERROR:", error);
    res.status(500).json({ error: "Failed to compute revisit rate" });
  }
});

app.get("/metrics/drift/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const activities = await prisma.lessonActivity.findMany({
      where: { userId },
      include: { lesson: true },
      orderBy: { timestamp: "asc" },
    });

    if (activities.length < 2) {
      return res.json({ driftDetected: false, reason: "Insufficient data" });
    }

    const mid = Math.floor(activities.length / 2);

    const avgEngagement = (acts) =>
      acts.reduce((sum, a) => {
        const expected = a.lesson.contentLength * 60;
        return sum + a.timeSpent / expected;
      }, 0) / acts.length;

    const earlyEngagement = avgEngagement(activities.slice(0, mid));
    const recentEngagement = avgEngagement(activities.slice(mid));

    const driftDetected = recentEngagement < earlyEngagement * 0.7;

    res.json({
      earlyEngagement: Number(earlyEngagement.toFixed(2)),
      recentEngagement: Number(recentEngagement.toFixed(2)),
      driftDetected,
    });
  } catch (error) {
    console.error("DRIFT METRIC ERROR:", error);
    res.status(500).json({ error: "Failed to detect intent drift" });
  }
});

app.get("/metrics/intent-report/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const activities = await prisma.lessonActivity.findMany({
      where: { userId },
      include: { lesson: true },
      orderBy: { timestamp: "asc" },
    });

    if (activities.length === 0) {
      return res.json({ message: "No activity data available" });
    }

    let shallowCompletions = 0;
    let totalCompletions = 0;
    const revisitMap = {};

    let totalDepth = 0;

    activities.forEach((a) => {
      const expected = a.lesson.contentLength * 60;
      const depth = a.timeSpent / expected;
      totalDepth += depth;

      if (a.completed) {
        totalCompletions++;
        if (depth < 0.4) shallowCompletions++;
      }

      revisitMap[a.lessonId] = (revisitMap[a.lessonId] || 0) + 1;
    });

    const avgEngagementDepth = totalDepth / activities.length;
    const completionConsistency =
      totalCompletions === 0
        ? "N/A"
        : `${shallowCompletions}/${totalCompletions} shallow completions`;

    res.json({
      averageEngagementDepth: Number(avgEngagementDepth.toFixed(2)),
      completionConsistency,
      revisitSummary: revisitMap,
      totalActivities: activities.length,
    });
  } catch (error) {
    console.error("INTENT REPORT ERROR:", error);
    res.status(500).json({ error: "Failed to generate intent report" });
  }
});

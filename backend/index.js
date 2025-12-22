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

app.get("/metrics/effort-deviation/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const activities = await prisma.lessonActivity.findMany({
      where: { userId },
      include: { lesson: true },
    });

    const results = activities.map((a) => {
      const expectedTime = a.lesson.contentLength * 60;
      const effortDeviation = a.timeSpent - expectedTime;

      return {
        lessonId: a.lessonId,
        timeSpent: a.timeSpent,
        expectedTime,
        effortDeviation,
        timestamp: a.timestamp,
      };
    });

    res.json(results);
  } catch (error) {
    console.error("EFFORT DEVIATION ERROR:", error);
    res.status(500).json({ error: "Failed to compute effort deviation" });
  }
});

app.get("/metrics/early-exit/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const activities = await prisma.lessonActivity.findMany({
      where: { userId },
      include: { lesson: true },
    });

    const results = activities.map((a) => {
      const expectedTime = a.lesson.contentLength * 60;
      const earlyExit =
        a.completed === false && a.timeSpent < expectedTime * 0.3;

      return {
        lessonId: a.lessonId,
        timeSpent: a.timeSpent,
        expectedTime,
        earlyExit,
        timestamp: a.timestamp,
      };
    });

    res.json(results);
  } catch (error) {
    console.error("EARLY EXIT ERROR:", error);
    res.status(500).json({ error: "Failed to compute early exit indicator" });
  }
});

app.get("/metrics/difficulty-avoidance/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const activities = await prisma.lessonActivity.findMany({
      where: { userId },
      include: { lesson: true },
    });

    const difficultyMap = {};

    activities.forEach((a) => {
      const expected = a.lesson.contentLength * 60;
      const depth = a.timeSpent / expected;
      const level = a.lesson.difficultyLevel;

      if (!difficultyMap[level]) {
        difficultyMap[level] = { totalDepth: 0, count: 0 };
      }

      difficultyMap[level].totalDepth += depth;
      difficultyMap[level].count += 1;
    });

    const results = Object.entries(difficultyMap).map(
      ([difficulty, data]) => ({
        difficulty,
        averageEngagementDepth: Number(
          (data.totalDepth / data.count).toFixed(2)
        ),
      })
    );

    res.json(results);
  } catch (error) {
    console.error("DIFFICULTY AVOIDANCE ERROR:", error);
    res.status(500).json({ error: "Failed to compute difficulty avoidance" });
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
    let earlyExits = 0;
    let totalDepth = 0;

    const difficultyMap = {};
    const depthTimeline = [];

    activities.forEach((a) => {
      const expected = a.lesson.contentLength * 60;
      const depth = a.timeSpent / expected;

      totalDepth += depth;
      depthTimeline.push(depth);

      if (a.completed) {
        totalCompletions++;
        if (depth < 0.4) shallowCompletions++;
      }

      if (!a.completed && a.timeSpent < expected * 0.3) {
        earlyExits++;
      }

      const level = a.lesson.difficultyLevel;
      if (!difficultyMap[level]) {
        difficultyMap[level] = { total: 0, count: 0 };
      }
      difficultyMap[level].total += depth;
      difficultyMap[level].count += 1;
    });

    const avgEngagement = totalDepth / activities.length;

    // Drift detection
    const mid = Math.floor(depthTimeline.length / 2);
    const earlyAvg =
      depthTimeline.slice(0, mid).reduce((a, b) => a + b, 0) /
      Math.max(mid, 1);
    const recentAvg =
      depthTimeline.slice(mid).reduce((a, b) => a + b, 0) /
      Math.max(depthTimeline.length - mid, 1);

    const driftDetected = recentAvg < earlyAvg * 0.7;

    // Difficulty avoidance summary
    const difficultySummary = Object.entries(difficultyMap).map(
      ([difficulty, data]) => ({
        difficulty,
        avgEngagementDepth: Number((data.total / data.count).toFixed(2)),
      })
    );

    // Explanations
    const explanations = [];

    if (avgEngagement < 0.5) {
      explanations.push("Overall engagement is low compared to expectations.");
    }

    if (shallowCompletions > 0) {
      explanations.push(
        "Multiple lessons were completed with insufficient engagement time."
      );
    }

    if (earlyExits > 0) {
      explanations.push(
        "Frequent early exits detected, indicating possible disengagement."
      );
    }

    const hard = difficultySummary.find((d) => d.difficulty === "hard");
    const easy = difficultySummary.find((d) => d.difficulty === "easy");

    if (hard && easy && hard.avgEngagementDepth < easy.avgEngagementDepth * 0.5) {
      explanations.push(
        "Engagement drops significantly on higher difficulty lessons."
      );
    }

    if (driftDetected) {
      explanations.push(
        "Engagement has declined over time, indicating intent drift."
      );
    }

    res.json({
      summary: {
        averageEngagementDepth: Number(avgEngagement.toFixed(2)),
        shallowCompletions,
        earlyExits,
        driftDetected,
      },
      difficultySummary,
      explanations,
    });
  } catch (error) {
    console.error("INTENT REPORT ERROR:", error);
    res.status(500).json({ error: "Failed to generate intent report" });
  }
});

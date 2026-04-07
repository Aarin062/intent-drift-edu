const { calculateLearnerMetrics, classifyIntent } = require("./metricsService");

const cors = require("cors");
const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const prisma = new PrismaClient();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Intent Drift Backend is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/metrics/batch/intent-summary", async (req, res) => {
  try {
    const learners = await prisma.user.findMany({
      include: {
        activities: {
          include: {
            lesson: true
          }
        }
      }
    });

    let healthy = 0;
    let disengaged = 0;
    let earlyExitPattern = 0;
    let difficultyAvoidance = 0;

    const allMetrics = learners.map((learner) => {
      const metrics = calculateLearnerMetrics(learner.activities);
      const intentStatus = classifyIntent(metrics);

      if (intentStatus === "Healthy") healthy++;
      if (intentStatus === "Disengaged") disengaged++;
      if (intentStatus === "Early Exit Pattern") earlyExitPattern++;
      if (intentStatus === "Difficulty Avoidance") difficultyAvoidance++;

      return metrics;
    });

    const avgEngagement =
      allMetrics.reduce((sum, m) => sum + m.engagementDepth, 0) /
      (allMetrics.length || 1);

    res.json({
      totalLearners: learners.length,
      averageEngagementDepth: Number(avgEngagement.toFixed(2)),
      riskDistribution: {
        healthy,
        disengaged,
        earlyExitPattern,
        difficultyAvoidance
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate batch summary" });
  }
});

app.get("/metrics/learner/:id", async (req, res) => {
  try {
    const learnerId = parseInt(req.params.id);

    const activities = await prisma.lessonActivity.findMany({
      where: { userId: learnerId },
      include: {
        lesson: true
      }
    });

    const metrics = calculateLearnerMetrics(activities);

    res.json(metrics);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch learner metrics" });
  }
});

app.get("/learners", async (req, res) => {
  try {
    const learners = await prisma.user.findMany({
      include: {
        activities: {
          include: {
            lesson: true
          }
        }
      }
    });

    const enriched = learners.map((learner) => {
      const metrics = calculateLearnerMetrics(learner.activities);
      return {
        id: learner.id,
        name: learner.name,
        email: learner.email,
        intentStatus: metrics.intentStatus
      };
    });

    res.json(enriched);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch learners" });
  }
});

// =============================
// Individual Metric Calculators
// =============================

// Engagement Depth
function getEngagementDepth(activities) {
  if (!activities.length) return 0;

  const totalRatio = activities.reduce((sum, a) => {
    const expectedSeconds = a.lesson.contentLength * 60;
    const ratio = Math.min(a.timeSpent / expectedSeconds, 1);
    return sum + ratio;
  }, 0);

  return Number((totalRatio / activities.length).toFixed(2));
}

// Early Exit Rate
function getEarlyExitRate(activities) {
  if (!activities.length) return 0;

  const earlyExits = activities.filter(
    (a) => a.timeSpent < a.lesson.contentLength * 30
  ).length;

  return Number((earlyExits / activities.length).toFixed(2));
}

// Difficulty Avoidance
function getDifficultyAvoidance(activities) {
  if (!activities.length) return 0;

  const hardLessons = activities.filter(
    (a) => a.lesson.difficultyLevel === "hard"
  );

  if (!hardLessons.length) return 0;

  const avoidedHard = hardLessons.filter(
    (a) => a.timeSpent < a.lesson.contentLength * 30
  ).length;

  return Number((avoidedHard / hardLessons.length).toFixed(2));
}

// Completion Consistency
function getCompletionConsistency(activities) {
  if (!activities.length) return 0;

  const completed = activities.filter((a) => a.completed).length;
  return Number((completed / activities.length).toFixed(2));
}

// Effort Deviation (Expected vs Actual)
function getEffortDeviation(activities) {
  if (!activities.length) return 0;

  const totalDeviation = activities.reduce((sum, a) => {
    const expected = a.lesson.contentLength * 60;
    const deviation = Math.abs(a.timeSpent - expected) / expected;
    return sum + deviation;
  }, 0);

  return Number((totalDeviation / activities.length).toFixed(2));
}

// =============================
// Timeline Generator
// =============================

function generateTimeline(activities) {
  if (!activities.length) return [];

  return activities.map((a) => {
    const expectedSeconds = a.lesson.contentLength * 60;
    const engagementScore = Math.min(a.timeSpent / expectedSeconds, 1);

    return {
      timestamp: a.timestamp,
      engagementScore: Number(engagementScore.toFixed(2))
    };
  });
}

// =============================
// Main Learner Metric Aggregator
// =============================

function classifyIntent(metrics) {
  if (metrics.engagementDepth < 0.3) {
    return "Disengaged";
  }

  if (metrics.earlyExit > 0.5) {
    return "Early Exit Pattern";
  }

  if (metrics.difficultyAvoidance > 0.5) {
    return "Difficulty Avoidance";
  }

  return "Healthy";
}


function calculateLearnerMetrics(activities) {
  if (!activities.length) {
    return {
      engagementDepth: 0,
      earlyExit: 0,
      difficultyAvoidance: 0,
      completionConsistency: 0,
      effortDeviation: 0,
      timeline: [],
      intentStatus: "No Activity"
    };
  }

  const baseMetrics = {
    engagementDepth: getEngagementDepth(activities),
    earlyExit: getEarlyExitRate(activities),
    difficultyAvoidance: getDifficultyAvoidance(activities),
    completionConsistency: getCompletionConsistency(activities),
    effortDeviation: getEffortDeviation(activities),
    timeline: generateTimeline(activities)
  };

  return {
    ...baseMetrics,
    intentStatus: classifyIntent(baseMetrics)
  };
}

// =============================
// Exports
// =============================

module.exports = {
  getEngagementDepth,
  getEarlyExitRate,
  getDifficultyAvoidance,
  getCompletionConsistency,
  getEffortDeviation,
  calculateLearnerMetrics,
  classifyIntent
};

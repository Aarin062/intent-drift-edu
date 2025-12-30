function ClassOverview({ summary }) {
  if (!summary) {
    return <p>Loading class summary...</p>;
  }

  return (
    <section>
      <h2>Class Overview</h2>
      <p>Total Learners: {summary.totalLearners}</p>
      <p>Average Engagement Depth: {summary.averageEngagementDepth.toFixed(2)}</p>
      <p>Learners With Drift: {summary.learnersWithDrift}</p>
      <p>Learners With Early Exit: {summary.learnersWithEarlyExit}</p>
      <p>
        Difficulty Avoidance Widespread:{" "}
        {summary.widespreadDifficultyAvoidance ? "Yes" : "No"}
      </p>
    </section>
  );
}

export default ClassOverview;

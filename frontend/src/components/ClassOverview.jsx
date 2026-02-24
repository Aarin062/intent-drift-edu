function ClassOverview({ summary }) {
  if (!summary) return <p>Loading class summary...</p>;

  const { riskDistribution } = summary;

  return (
    <section>
      <h2>Class Overview</h2>

      <p>Total Learners: {summary.totalLearners}</p>
      <p>Average Engagement Depth: {summary.averageEngagementDepth}</p>

      <h3>Risk Distribution</h3>
      <ul>
        <li>Healthy: {riskDistribution.healthy}</li>
        <li>Disengaged: {riskDistribution.disengaged}</li>
        <li>Early Exit Pattern: {riskDistribution.earlyExitPattern}</li>
        <li>Difficulty Avoidance: {riskDistribution.difficultyAvoidance}</li>
      </ul>
    </section>
  );
}

export default ClassOverview;

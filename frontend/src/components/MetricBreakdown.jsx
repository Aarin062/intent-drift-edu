function MetricBreakdown({ metrics }) {
  if (!metrics) return null;

  return (
    <section>
      <h3>Metric Breakdown</h3>
      <ul>
        <li>Engagement Depth: {metrics.engagementDepth}</li>
        <li>Early Exit Rate: {metrics.earlyExitRate}</li>
        <li>Difficulty Avoidance: {metrics.difficultyAvoidance}</li>
        <li>Completion Consistency: {metrics.completionConsistency}</li>
        <li>Effort Deviation: {metrics.effortDeviation}</li>
      </ul>
    </section>
  );
}

export default MetricBreakdown;

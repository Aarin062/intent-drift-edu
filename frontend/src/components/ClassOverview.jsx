function ClassOverview({ summary, onRiskClick }) {
  if (!summary) return <p>Loading class summary...</p>;

  const { riskDistribution } = summary;

  const total =
    riskDistribution.healthy +
    riskDistribution.disengaged +
    riskDistribution.earlyExitPattern +
    riskDistribution.difficultyAvoidance;

  const createBar = (label, value, color) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;

    return (
      <div
        onClick={() => onRiskClick && onRiskClick(label)}
        style={{
          marginBottom: "15px",
          cursor: "pointer"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{label}</span>
          <span>
            {value} ({percentage.toFixed(0)}%)
          </span>
        </div>

        <div
          style={{
            backgroundColor: "#444",
            height: "8px",
            borderRadius: "5px",
            marginTop: "5px"
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
              height: "100%",
              borderRadius: "5px"
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <section>
      <h2>Class Overview</h2>

      <p>Total Learners: {summary.totalLearners}</p>
      <p>Average Engagement Depth: {summary.averageEngagementDepth}</p>

      <h3 style={{ marginTop: "20px" }}>Risk Distribution</h3>

      {createBar("Healthy", riskDistribution.healthy, "#4CAF50")}
      {createBar("Disengaged", riskDistribution.disengaged, "#F44336")}
      {createBar(
        "Early Exit Pattern",
        riskDistribution.earlyExitPattern,
        "#FF9800"
      )}
      {createBar(
        "Difficulty Avoidance",
        riskDistribution.difficultyAvoidance,
        "#9C27B0"
      )}
    </section>
  );
}

function StatusBar({ label, value, percentage, color }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{label}</span>
        <span>{value} ({percentage}%)</span>
      </div>
      <div
        style={{
          height: "8px",
          backgroundColor: "#ddd",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}

export default ClassOverview;
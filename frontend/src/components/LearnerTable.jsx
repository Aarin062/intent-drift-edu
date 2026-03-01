function LearnerTable({ learners, onSelect }) {
  if (!learners || learners.length === 0) {
    return (
      <section style={{ marginTop: "40px" }}>
        <h2>Learners</h2>
        <p>No learners found.</p>
      </section>
    );
  }

  const getTrendSymbol = (timeline) => {
    if (!timeline || timeline.length < 2) return "→";

    const first = timeline[0].engagementScore;
    const last = timeline[timeline.length - 1].engagementScore;

    if (last > first + 0.1) return "↑";
    if (last < first - 0.1) return "↓";
    return "→";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Disengaged":
        return "#ff4d4d";
      case "Early Exit Pattern":
        return "#ff944d";
      case "Difficulty Avoidance":
        return "#b84dff";
      default:
        return "#4CAF50";
    }
  };

  return (
    <section style={{ marginTop: "40px" }}>
      <h2 style={{ marginBottom: "20px" }}>Learners</h2>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "0 10px"
          }}
        >
          <thead>
            <tr style={{ textAlign: "left", color: "#aaa" }}>
              <th style={{ padding: "10px 15px" }}>ID</th>
              <th style={{ padding: "10px 15px" }}>Name</th>
              <th style={{ padding: "10px 15px" }}>Status</th>
              <th style={{ padding: "10px 15px" }}>Engagement</th>
              <th style={{ padding: "10px 15px" }}>Early Exit</th>
              <th style={{ padding: "10px 15px" }}>Trend</th>
            </tr>
          </thead>

          <tbody>
            {learners.map((learner) => {
              const { metrics } = learner;

              return (
                <tr
                  key={learner.id}
                  onClick={() => onSelect(learner)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: "#1e1e1e",
                    borderRadius: "8px"
                  }}
                >
                  <td style={{ padding: "15px" }}>
                    {learner.id}
                  </td>

                  <td style={{ padding: "15px" }}>
                    <div style={{ fontWeight: "600" }}>
                      {learner.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#aaa" }}>
                      {learner.email}
                    </div>
                  </td>

                  <td style={{ padding: "15px" }}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        backgroundColor: getStatusColor(
                          metrics?.intentStatus
                        ),
                        color: "white",
                        fontSize: "12px",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {metrics?.intentStatus}
                    </span>
                  </td>

                  <td style={{ padding: "15px" }}>
                    {metrics?.engagementDepth}
                  </td>

                  <td style={{ padding: "15px" }}>
                    {metrics?.earlyExit}
                  </td>

                  <td style={{ padding: "15px", fontSize: "18px" }}>
                    {getTrendSymbol(metrics?.timeline)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default LearnerTable;
import { useEffect, useState } from "react";
import MetricBreakdown from "./MetricBreakdown";
import IntentTimeline from "./IntentTimeline";
import { getLearnerMetrics } from "../services/api";

function LearnerDetail({ learner }) {
  const [metrics, setMetrics] = useState(null);
  const [showFormula, setShowFormula] = useState(false);

  useEffect(() => {
    if (!learner) return;

    getLearnerMetrics(learner.id)
      .then(setMetrics)
      .catch(console.error);
  }, [learner]);

  if (!learner) {
    return (
      <section>
        <h2>Learner Detail</h2>
        <p>Select a learner to view intent analysis</p>
      </section>
    );
  }

  const getTrendLabel = (drift) => {
    if (drift < -0.1) return "📉 Declining";
    if (drift > 0.1) return "📈 Improving";
    return "➡️ Stable";
  };

  return (
    <section>
      <h2>Learner Detail</h2>
      <p><strong>Name:</strong> {learner.name}</p>
      <p><strong>Email:</strong> {learner.email}</p>

      {metrics ? (
  <>
    <div style={{ margin: "10px 0" }}>
      <strong>Intent Status: </strong>
      <span
        style={{
          padding: "6px 10px",
          borderRadius: "6px",
          backgroundColor:
            metrics.intentStatus === "Disengaged"
              ? "#ff4d4d"
              : metrics.intentStatus === "Early Exit Pattern"
              ? "#ff944d"
              : metrics.intentStatus === "Difficulty Avoidance"
              ? "#9C27B0"
              : "#4CAF50",
          color: "white"
        }}
      >
        {metrics.intentStatus}
      </span>
        <p style={{ marginTop: "10px" }}>
        <strong>Engagement Trend:</strong>{" "}
        <span
          style={{
            color:
              metrics.intentDrift < -0.1
                ? "#F44336"
                : metrics.intentDrift > 0.1
                ? "#4CAF50"
                : "#ccc"
          }}
        >
          {getTrendLabel(metrics.intentDrift)} (
          {metrics.intentDrift > 0 ? "+" : ""}
          {metrics.intentDrift}
          )
        </span>
      </p>
    </div>

    <MetricBreakdown metrics={metrics} />

    <div style={{ marginTop: "20px" }}>
      <button
        onClick={() => setShowFormula(!showFormula)}
        style={{
          background: "none",
          border: "none",
          color: "#4da6ff",
          cursor: "pointer",
          fontSize: "14px",
          padding: 0
        }}
      >
        ℹ How are these metrics calculated?
      </button>

      {showFormula && (
        <div
          style={{
            marginTop: "15px",
            padding: "15px",
            backgroundColor: "#1a1a1a",
            borderRadius: "8px",
            fontSize: "14px",
            lineHeight: "1.6",
            color: "#ccc"
          }}
        >
          <p>
            <strong>Engagement Trend:</strong><br />
            (Recent Engagement Avg − Earlier Engagement Avg)<br />
            Shows whether the learner is improving or declining over time.
          </p>

          <p>
            <strong>Engagement Depth:</strong><br />
            timeSpent ÷ (lessonLength × 60)
          </p>

          <p>
            <strong>Early Exit Rate:</strong><br />
            Sessions where timeSpent &lt; 30% of expected time
          </p>

          <p>
            <strong>Difficulty Avoidance:</strong><br />
            Hard lesson engagement compared to easy lessons
          </p>

          <p>
            <strong>Completion Consistency:</strong><br />
            completedSessions ÷ totalSessions
          </p>
        </div>
      )}
    </div>

    <IntentTimeline 
  timeline={metrics.timeline}
  intentStatus={metrics.intentStatus}
/>
  </>
) : (
  <p>Loading learner metrics...</p>
)}
    </section>
  );
}

export default LearnerDetail;

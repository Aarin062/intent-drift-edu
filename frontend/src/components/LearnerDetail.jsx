import { useEffect, useState } from "react";
import MetricBreakdown from "./MetricBreakdown";
import IntentTimeline from "./IntentTimeline";
import { getLearnerMetrics } from "../services/api";

function LearnerDetail({ learner }) {
  const [metrics, setMetrics] = useState(null);

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
              ? "#ffd633"
              : "#4CAF50",
          color: "white"
        }}
      >
        {metrics.intentStatus}
      </span>
    </div>

    <MetricBreakdown metrics={metrics} />
    <IntentTimeline timeline={metrics.timeline} />
  </>
) : (
  <p>Loading learner metrics...</p>
)}
    </section>
  );
}

export default LearnerDetail;

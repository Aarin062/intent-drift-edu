import MetricBreakdown from "./MetricBreakdown";
import IntentTimeline from "./IntentTimeline";

function LearnerDetail() {
  return (
    <section>
      <h2>Learner Detail</h2>
      <p>Select a learner to view intent analysis</p>

      <MetricBreakdown />
      <IntentTimeline />
    </section>
  );
}

export default LearnerDetail;

function IntentTimeline({ timeline }) {
  if (!timeline || !timeline.length) {
    return <p>No activity data available.</p>;
  }

  return (
    <section>
      <h3>Intent Timeline</h3>
      <ul>
        {timeline.map((point, index) => (
          <li key={index}>
            {new Date(point.timestamp).toLocaleString()} — Engagement: {point.engagementScore.toFixed(2)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default IntentTimeline;

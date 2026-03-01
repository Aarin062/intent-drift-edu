import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function IntentTimeline({ timeline = [], intentStatus = "Healthy" }) {
  if (!timeline || timeline.length === 0) {
    return <p>No activity data available.</p>;
  }

  let lineColor = "#4CAF50"; // default green

  if (intentStatus === "Disengaged") {
    lineColor = "#ff4d4d";
  } else if (intentStatus === "Early Exit Pattern") {
    lineColor = "#ff944d";
  } else if (intentStatus === "Difficulty Avoidance") {
    lineColor = "#9C27B0";
  }

  // Format timestamps into readable dates
  const formattedData = timeline.map((item) => ({
    ...item,
    date: new Date(item.timestamp).toLocaleDateString()
  }));

  return (
    <section style={{ marginTop: "20px" }}>
      <h3>Engagement Timeline</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          
          <XAxis 
            dataKey="date"
            label={{ value: "Date", position: "insideBottom", offset: -5 }}
          />
          
          <YAxis 
            domain={[0, 1]}
            label={{ value: "Engagement Score", angle: -90, position: "insideLeft" }}
          />
          
          <Tooltip />

          <Line
            type="monotone"
            dataKey="engagementScore"
            stroke={lineColor}
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}

export default IntentTimeline;
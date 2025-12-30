export async function getBatchIntentSummary() {
  const res = await fetch("http://localhost:3000/metrics/batch/intent-summary");
  return res.json();
}

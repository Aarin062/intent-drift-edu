export async function getBatchIntentSummary() {
  const res = await fetch("http://localhost:3000/metrics/batch/intent-summary");
  return res.json();
}

export async function getLearners() {
  const res = await fetch("http://localhost:3000/learners");
  return res.json();
}

export async function getLearnerMetrics(id) {
  const res = await fetch(`http://localhost:3000/metrics/learner/${id}`);
  return res.json();
}


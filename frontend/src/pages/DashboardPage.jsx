import { useEffect, useState } from "react";
import Header from "../components/Header";
import ClassOverview from "../components/ClassOverview";
import LearnerTable from "../components/LearnerTable";
import LearnerDetail from "../components/LearnerDetail";
import {
  getBatchIntentSummary,
  getLearners,
  getLearnerMetrics
} from "../services/api";

function DashboardPage() {
  // 🔹 class-level state
  const [batchSummary, setBatchSummary] = useState(null);

  // 🔹 learner-level state
  const [learners, setLearners] = useState([]);
  const [selectedLearner, setSelectedLearner] = useState(null);

  // 🔹 filter + search + sort state
  const [riskFilter, setRiskFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc"); // asc = low→high

  // 🔹 Load all data
  useEffect(() => {
    async function loadData() {
      try {
        const summaryData = await getBatchIntentSummary();
        setBatchSummary(summaryData);

        const learnerList = await getLearners();

        const learnersWithMetrics = await Promise.all(
          learnerList.map(async (learner) => {
            const metrics = await getLearnerMetrics(learner.id);
            return { ...learner, metrics };
          })
        );

        setLearners(learnersWithMetrics);
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    }

    loadData();
  }, []);

  // 🔹 Step 1 — Apply Risk Filter
  let filteredLearners = learners;

  if (riskFilter) {
    filteredLearners = filteredLearners.filter(
      (l) => l.metrics?.intentStatus === riskFilter
    );
  }

  // 🔹 Step 2 — Apply Search
  if (searchQuery.trim() !== "") {
    filteredLearners = filteredLearners.filter((l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(l.id).includes(searchQuery)
    );
  }

  // 🔹 Step 3 — Sort by Engagement
  const sortedLearners = [...filteredLearners].sort((a, b) => {
    const engagementA = a.metrics?.engagementDepth || 0;
    const engagementB = b.metrics?.engagementDepth || 0;

    return sortDirection === "asc"
      ? engagementA - engagementB
      : engagementB - engagementA;
  });

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
      <Header />

      {/* CLASS OVERVIEW CARD */}
      <div
        style={{
          backgroundColor: "#1e1e1e",
          padding: "25px",
          borderRadius: "12px",
          marginBottom: "25px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.4)"
        }}
      >
        <ClassOverview
            summary={batchSummary}
            onRiskClick={(risk) => setRiskFilter(risk)}
          />
      </div>

      {/* FILTER SECTION */}
      <div
        style={{
          backgroundColor: "#1e1e1e",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "25px"
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Filter & Search</h3>

        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          {/* Risk Filter */}
          <select
            value={riskFilter || "All"}
            onChange={(e) =>
              setRiskFilter(e.target.value === "All" ? null : e.target.value)
            }
            style={{
              padding: "8px",
              borderRadius: "8px",
              backgroundColor: "#2b2b2b",
              color: "white",
              border: "1px solid #444"
            }}
          >
            <option value="All">All</option>
            <option value="Disengaged">Disengaged</option>
            <option value="Early Exit Pattern">Early Exit Pattern</option>
            <option value="Difficulty Avoidance">Difficulty Avoidance</option>
            <option value="Healthy">Healthy</option>
          </select>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "8px",
              backgroundColor: "#2b2b2b",
              color: "white",
              border: "1px solid #444",
              minWidth: "250px"
            }}
          />

          {/* Sort Toggle */}
          <button
            onClick={() =>
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            }
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              backgroundColor: "#333",
              color: "white",
              border: "1px solid #555",
              cursor: "pointer"
            }}
          >
            Sort: {sortDirection === "asc" ? "Low → High" : "High → Low"}
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "25px"
        }}
      >
        {/* LEARNER LIST */}
        <div
          style={{
            backgroundColor: "#1e1e1e",
            padding: "20px",
            borderRadius: "12px"
          }}
        >
          <h3 style={{ marginBottom: "15px" }}>Learners</h3>

          {riskFilter && (
            <div style={{ marginBottom: "10px" }}>
              Showing: <strong>{riskFilter}</strong>
              <button
                style={{ marginLeft: "10px" }}
                onClick={() => setRiskFilter(null)}
              >
                Clear
              </button>
            </div>
          )}

          {sortedLearners.length === 0 ? (
            <p>No learners found.</p>
          ) : (
            <LearnerTable
              learners={sortedLearners}
              onSelect={setSelectedLearner}
            />
          )}
        </div>

        {/* LEARNER DETAIL */}
        <div
          style={{
            backgroundColor: "#1e1e1e",
            padding: "20px",
            borderRadius: "12px"
          }}
        >
          <LearnerDetail learner={selectedLearner} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
import { useEffect, useState } from "react";
import Header from "../components/Header";
import ClassOverview from "../components/ClassOverview";
import LearnerTable from "../components/LearnerTable";
import LearnerDetail from "../components/LearnerDetail";
import {
  getBatchIntentSummary,
  getLearners
} from "../services/api";

function DashboardPage() {
  // 🔹 class-level
  const [batchSummary, setBatchSummary] = useState(null);

  // 🔹 learner-level
  const [learners, setLearners] = useState([]);
  const [selectedLearner, setSelectedLearner] = useState(null);

  // fetch class summary
  useEffect(() => {
    getBatchIntentSummary()
      .then(setBatchSummary)
      .catch(console.error);
  }, []);

  // fetch learners
  useEffect(() => {
    getLearners()
      .then(setLearners)
      .catch(console.error);
  }, []);

  return (
    <div>
      <Header />

      <ClassOverview summary={batchSummary} />

      <LearnerTable
        learners={learners}
        onSelect={setSelectedLearner}
      />

      <LearnerDetail learner={selectedLearner} />
    </div>
  );
}

export default DashboardPage;

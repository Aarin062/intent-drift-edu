import { useEffect, useState } from "react";
import Header from "../components/Header";
import ClassOverview from "../components/ClassOverview";
import LearnerTable from "../components/LearnerTable";
import LearnerDetail from "../components/LearnerDetail";
import { getBatchIntentSummary } from "../services/api";

function DashboardPage() {
  const [batchSummary, setBatchSummary] = useState(null);

  // useEffect(() => {
  //   getBatchIntentSummary()
  //     .then((data) => setBatchSummary(data))
  //     .catch((err) => console.error(err));
  // }, []);

  useEffect(() => {
  console.log("useEffect triggered");

  getBatchIntentSummary()
    .then((data) => {
      console.log("Batch summary data:", data);
      setBatchSummary(data);
    })
    .catch((err) => console.error(err));
}, []);


  return (
    <div>
      <Header />
      <ClassOverview summary={batchSummary} />
      <LearnerTable />
      <LearnerDetail />
    </div>
  );
}

export default DashboardPage;

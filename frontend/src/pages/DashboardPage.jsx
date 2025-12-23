import Header from "../components/Header";
import ClassOverview from "../components/ClassOverview";
import LearnerTable from "../components/LearnerTable";
import LearnerDetail from "../components/LearnerDetail";

function DashboardPage() {
  return (
    <div>
      <Header />
      <ClassOverview />
      <LearnerTable />
      <LearnerDetail />
    </div>
  );
}

export default DashboardPage;

function LearnerTable({ learners = [], onSelect, selectedLearner }) {
  return (
    <section>
      <h2>Learners</h2>

      {learners.length === 0 ? (
        <p>No learners found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {learners.map((learner) => (
              <tr
                key={learner.id}
                onClick={() => onSelect(learner)}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedLearner?.id === learner.id ? "#2a2a2a" : "transparent"
                }}
              >
                <td>{learner.name}</td>
                <td>{learner.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default LearnerTable;

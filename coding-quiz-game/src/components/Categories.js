export function CategoriesBox({ children }) {
  return <div className="quiz-categories">{children}</div>;
}

export function Subtitle() {
  return (
    <h2 className="subtitle">
      🤔 Choose your Quiz's <br/>Category and Difficulty!
    </h2>
  );
}

export function SelectQuiz({ setSelectedItem, arr }) {
  return (
    <select
      className="list-elements"
      onChange={(e) => setSelectedItem(e.target.value)}
    >
      {arr.map((element) => (
        <option value={element} key={element}>
          {element}
        </option>
      ))}
    </select>
  );
}

export function ButtonCategories({
  selectedCategory,
  setQuestions,
  selectedDifficulty,
  setIsLoading,
  setQuizStarted,
}) {
  return (
    <button
      className="btn-categories"
      onClick={() => {
        setQuizStarted(true);
      }}
    >
      Start Quiz
    </button>
  );
}

import { fetchQuiz } from "./App";

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
        fetchQuiz(
          selectedCategory,
          setQuestions,
          selectedDifficulty,
          setIsLoading
        );
      }}
    >
      Start Quiz
    </button>
  );
}

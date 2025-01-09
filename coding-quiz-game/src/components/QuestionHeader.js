export function QuestionHeader({ questions, questionNumber, onResetQuiz }) {
  return (
    <>
      <h3 className="question-title">
        {questions[questionNumber - 1].category} Quiz
      </h3>
      <span className="question-number">
        {questionNumber}/{questions.length}
      </span>
      <span className="question-arrow" onClick={onResetQuiz}>
        &larr;
      </span>
      <p className="question-description">
        {questions[questionNumber - 1].question}
      </p>
    </>
  );
}

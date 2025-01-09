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
export function QuestionAnswersList({
  questions,
  questionNumber,
  onUpdateAnswer,
  selectedAnswer,
}) {
  const answers = questions[questionNumber - 1].answers;
  return (
    <div className="answers-list">
      {Object.entries(answers).map(
        ([key, value]) =>
          value && ( // Render only non-null answers
            <button
              key={key}
              className={`answers ${
                selectedAnswer === key ? "answer-selected" : ""
              }`}
              value={key}
              onClick={() => onUpdateAnswer(key)}
            >
              {value}
            </button>
          )
      )}
    </div>
  );
}
export function QuestionFooter({ checkCorrectAnswer, questionNumber }) {
  return (
    <button className="question-next" onClick={checkCorrectAnswer}>
      {questionNumber < 10 ? "Next" : "Finish"} &rarr;
    </button>
  );
}

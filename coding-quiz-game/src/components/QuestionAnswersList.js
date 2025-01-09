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

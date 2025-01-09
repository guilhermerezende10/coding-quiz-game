export function QuestionFooter({ checkCorrectAnswer, questionNumber }) {
  return (
    <button className="question-next" onClick={checkCorrectAnswer}>
      {questionNumber < 10 ? "Next" : "Finish"} &rarr;
    </button>
  );
}

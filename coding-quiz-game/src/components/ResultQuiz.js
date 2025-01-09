
export function ResultQuiz({ score, onPlayAgain, questionNumber }) {
  return (
    <div className="result-box">
      <h3 className="result-score">Your Score: {score}/{questionNumber}</h3>
      <button className="result-btn" onClick={onPlayAgain}>
        Play Again
      </button>
    </div>
  );
}

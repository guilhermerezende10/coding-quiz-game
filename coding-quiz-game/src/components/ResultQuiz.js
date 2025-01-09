export function ResultQuiz({ score, onPlayAgain }) {
  return (
    <div className="result-box">
      <h3 className="result-score">Your Score: {score}</h3>
      <button className="result-btn" onClick={onPlayAgain}>
        Play Again
      </button>
    </div>
  );
}

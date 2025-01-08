import { useEffect, useState } from "react";
import "./styles.css";

const API_KEY = "2Um4w0zjk1qtARGXcoFU6zNqliZrfkGPECVjHmjc";

const categories = [
  "React",
  "DevOps",
  "Linux",
  "Django",
  "VueJS",
  "NodeJs",
  "Code",
  "Next.js",
  "WordPress",
  "Docker",
  "bash",
  "Laravel",
  "SQL",
  "Apache Kafka",
];

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [rightAnswersCounter, setRightAnswersCounter] = useState(0);
  const [finishedQuiz, setFinishedQuiz] = useState(false);

  function handleBackHome() {
    setQuestions([]);
    setQuestionNumber(1);
  }

  function checkCorrectAnswer() {
    if (!selectedAnswer)
      return alert("Select a answer before going to the next one");
    const correctAnswerKey = `${selectedAnswer}_correct`;
    const isCorrect =
      questions[questionNumber - 1].correct_answers[correctAnswerKey] ===
      "true";

    if (isCorrect) {
      console.log("Correct answer!");
      setRightAnswersCounter((rightAnswersCounter) => rightAnswersCounter + 1);
    } else {
      console.log("Wrong answer.");
    }

    if (questionNumber < 10) nextPageOfQuestions();
    else finishQuiz();
  }

  function nextPageOfQuestions() {
    setQuestionNumber((questionNumber) => questionNumber + 1);
    setSelectedAnswer(null);
  }

  function finishQuiz() {
    setFinishedQuiz(true);
  }

  function updateAnswer(answer) {
    setSelectedAnswer(answer);
  }

  function playAgain() {
    setQuestions([]);
    setQuestionNumber(1);
    setFinishedQuiz(false)
  }

  return (
    <div className="App">
      <Title />
      {questions.length === 0 && !finishedQuiz && (
        <CategoriesBox>
          <Subtitle />
          <CategoriesList setSelectedCategory={setSelectedCategory} />
          <ButtonCategories
            selectedCategory={selectedCategory}
            questions={questions}
            setQuestions={setQuestions}
          />
        </CategoriesBox>
      )}
      {questions.length > 0 && !finishedQuiz && (
        <DisplayQuestions>
          <QuestionHeader
            questions={questions}
            questionNumber={questionNumber}
            OnHandleBackHome={handleBackHome}
          />
          <QuestionAnswersList
            questions={questions}
            questionNumber={questionNumber}
            onUpdateAnswer={updateAnswer}
            selectedAnswer={selectedAnswer}
          />
          <QuestionFooter
            checkCorrectAnswer={checkCorrectAnswer}
            questionNumber={questionNumber}
          />
        </DisplayQuestions>
      )}

      {finishedQuiz && <ResultQuiz score={rightAnswersCounter} onPlayAgain={playAgain}/>}
    </div>
  );
}

function DisplayQuestions({ children }) {
  return <div className="question-box">{children}</div>;
}

function QuestionHeader({ questions, questionNumber, OnHandleBackHome }) {
  return (
    <>
      <h3 className="question-title">
        {questions[questionNumber - 1].category} Quiz
      </h3>
      <span className="question-number">
        {questionNumber}/{questions.length}
      </span>
      <span className="question-arrow" onClick={OnHandleBackHome}>
        &larr;
      </span>
      <p className="question-description">
        {questions[questionNumber - 1].question}
      </p>
    </>
  );
}

function QuestionAnswersList({
  questions,
  questionNumber,
  onUpdateAnswer,
  selectedAnswer,
}) {
  const answers = questions[questionNumber - 1].answers;
  return (
    <div
      className="answers-list"
      onClick={(e) => onUpdateAnswer(e.target.value, questions)}
    >
      <p>
        <button
          className={`answers ${
            selectedAnswer === "answer_a" ? "answer-selected" : ""
          } `}
          value="answer_a"
        >
          A ) {answers.answer_a}
        </button>
      </p>
      <p>
        <button
          className={`answers ${
            selectedAnswer === "answer_b" ? "answer-selected" : ""
          } `}
          value="answer_b"
        >
          B ) {answers.answer_b}
        </button>
      </p>
      <p>
        <button
          className={`answers ${
            selectedAnswer === "answer_c" ? "answer-selected" : ""
          } `}
          value="answer_c"
        >
          C ) {answers.answer_c}
        </button>
      </p>
      <p>
        <button
          className={`answers ${
            selectedAnswer === "answer_d" ? "answer-selected" : ""
          } `}
          value="answer_d"
        >
          D ) {answers.answer_d}
        </button>
      </p>
    </div>
  );
}

function QuestionFooter({ checkCorrectAnswer, questionNumber }) {
  return (
    <>
      <NextButton checkCorrectAnswer={checkCorrectAnswer}>
        {questionNumber <= 9 ? "Next" : "Finish"} &rarr;
      </NextButton>
    </>
  );
}

function NextButton({ checkCorrectAnswer, children }) {
  return (
    <button className="question-next" onClick={checkCorrectAnswer}>
      {children}
    </button>
  );
}

function Title() {
  return <h1 className="title">📝 Coding Quiz Game</h1>;
}

function Subtitle() {
  return <h2 className="subtitle">🤔 Choose your quiz's category</h2>;
}

async function fetchQuiz(category, setQuestions) {
  console.log(category);
  const url = "https://quizapi.io/api/v1/questions";

  try {
    const res = await fetch(
      `${url}?apiKey=${API_KEY}&limit=10&category=${category}`
    );

    if (!res.ok) throw new Error(`Something went wrong. Try again later.`);

    const data = await res.json();

    console.log(data);

    if (data.Response === "False") throw new Error("Questions not found");

    setQuestions(data);
  } catch (err) {
    console.error(err);
    setQuestions([]);
  }
}

function CategoriesBox({ children }) {
  return <div className="quiz-categories">{children}</div>;
}

function Category({ category }) {
  return (
    <option value={category} className="category">
      {category}
    </option>
  );
}

function CategoriesList({ setSelectedCategory }) {
  return (
    <select
      className="list-categories"
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      {categories.map((category) => (
        <Category category={category} key={category} />
      ))}
    </select>
  );
}

function ButtonCategories({ selectedCategory, questions, setQuestions }) {
  return (
    <button
      className="btn-categories"
      onClick={() => fetchQuiz(selectedCategory, setQuestions)}
    >
      Choose
    </button>
  );
}

function ResultQuiz({score, onPlayAgain}) {
  return (
    <div className="result-box">
      <h3 className="result-score">Your Score: {score}</h3>
      <button className="result-btn" onClick={onPlayAgain}>Play again</button>
    </div>
  );
}

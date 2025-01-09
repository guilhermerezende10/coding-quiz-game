// Import required hooks and styles
import { useState, useEffect } from "react";
import "./styles.css";

// API key for fetching quiz data
const API_KEY = "2Um4w0zjk1qtARGXcoFU6zNqliZrfkGPECVjHmjc";

// Available quiz categories
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

// Quiz difficulty levels
const difficulty = ["Easy", "Medium", "Hard"];

// Utility function to fetch quiz data
async function fetchQuiz(
  category,
  setQuestions,
  selectedDifficulty,
  setIsLoading
) {
  const url = "https://quizapi.io/api/v1/questions";
  try {
    setIsLoading(true); // Show loader during fetch
    const res = await fetch(
      `${url}?apiKey=${API_KEY}&limit=10&category=${category}&difficulty=${selectedDifficulty}`
    );

    if (!res.ok) throw new Error("Failed to fetch quiz data.");

    const data = await res.json();
    setQuestions(data); // Update state with fetched questions
  } catch (err) {
    console.error(err);
    setQuestions([]); // Reset questions on error
  } finally {
    setIsLoading(false); // Hide loader after fetch
  }
}

// Main App component
export default function App() {
  // States for quiz configuration, progress, and results
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty[0]);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [rightAnswersCounter, setRightAnswersCounter] = useState(0);
  const [finishedQuiz, setFinishedQuiz] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  // Fetch questions whenever the quiz starts or settings change
  useEffect(() => {
    if (quizStarted) {
      setQuestions([]); // Reset questions when quiz restarts
      fetchQuiz(
        selectedCategory,
        setQuestions,
        selectedDifficulty,
        setIsLoading
      );
    }
  }, [quizStarted, selectedCategory, selectedDifficulty]);

  useEffect(() => {
    // Change the page title
    document.title = "Coding Quiz Game";

    // Dynamically add the favicon link
    const faviconLink = document.querySelector("link[rel='icon']");
    faviconLink.href = "./logo.ico";
  }, []);

  // Handle returning to the home screen
  function resetQuiz() {
    setQuestions([]);
    setQuestionNumber(1);
    setQuizStarted(false);
    setRightAnswersCounter(0);
    setSelectedAnswer(null);
    setFinishedQuiz(false);
  }

  // Check if the selected answer is correct
  function checkCorrectAnswer() {
    if (!selectedAnswer) return alert("Select an answer before proceeding.");
    const correctAnswerKey = `${selectedAnswer}_correct`;
    const isCorrect =
      questions[questionNumber - 1].correct_answers[correctAnswerKey] ===
      "true";

    if (isCorrect) setRightAnswersCounter((count) => count + 1);

    questionNumber < 10 ? nextQuestion() : finishQuiz(); // Advance or finish
  }

  // Move to the next question
  function nextQuestion() {
    setQuestionNumber((num) => num + 1);
    setSelectedAnswer(null);
  }

  // Mark the quiz as finished
  function finishQuiz() {
    setFinishedQuiz(true);
  }

  // Update the selected answer
  function updateAnswer(answer) {
    setSelectedAnswer(answer);
  }

  return (
    <div className="App">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/3.5.0/remixicon.min.css"
      ></link>
      {/* Header */}
      <Title />

      {/* Category selection */}
      {questions.length === 0 && !isLoading && !finishedQuiz && (
        <CategoriesBox>
          <Subtitle />
          <SelectQuiz setSelectedItem={setSelectedCategory} arr={categories} />
          <SelectQuiz
            setSelectedItem={setSelectedDifficulty}
            arr={difficulty}
          />
          <ButtonCategories
            selectedCategory={selectedCategory}
            questions={questions}
            setQuestions={setQuestions}
            selectedDifficulty={selectedDifficulty}
            setIsLoading={setIsLoading}
            setQuizStarted={setQuizStarted}
          />
        </CategoriesBox>
      )}

      {/* Loader */}
      {isLoading && <Loader />}

      {/* Questions display */}
      {questions.length > 0 && !finishedQuiz && (
        <DisplayQuestions>
          <QuestionHeader
            questions={questions}
            questionNumber={questionNumber}
            onResetQuiz={resetQuiz}
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

      {/* Quiz results */}
      {finishedQuiz && (
        <ResultQuiz score={rightAnswersCounter} onPlayAgain={resetQuiz} />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Components

function Title() {
  return (
    <>
      <h2 className="welcome">Welcome to the</h2>
      <h1 className="title">📝 Coding Quiz Game</h1>
    </>
  );
}

function Subtitle() {
  return <h2 className="subtitle">🤔 Choose your Quiz's Category</h2>;
}

function CategoriesBox({ children }) {
  return <div className="quiz-categories">{children}</div>;
}

function SelectQuiz({ setSelectedItem, arr }) {
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

function ButtonCategories({
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

function DisplayQuestions({ children }) {
  return <div className="question-box">{children}</div>;
}

function QuestionHeader({ questions, questionNumber, onResetQuiz }) {
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

function QuestionAnswersList({
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

function QuestionFooter({ checkCorrectAnswer, questionNumber }) {
  return (
    <button className="question-next" onClick={checkCorrectAnswer}>
      {questionNumber < 10 ? "Next" : "Finish"} &rarr;
    </button>
  );
}

function ResultQuiz({ score, onPlayAgain }) {
  return (
    <div className="result-box">
      <h3 className="result-score">Your Score: {score}</h3>
      <button className="result-btn" onClick={onPlayAgain}>
        Play Again
      </button>
    </div>
  );
}

function Loader() {
  return <div className="loader"></div>;
}

function Footer() {
  return (
    <footer className="container">
      <div className="socials">
        <span>
          Made by <strong>Guilherme Rezende</strong>
        </span>
        <a
          href="https://github.com/guilhermerezende10"
          target="_blank"
          rel="noreferrer"
        >
          <i className="ri-github-line"></i>
        </a>
        <a
          href="https://www.instagram.com/guilhermerezende.10/"
          target="_blank"
          rel="noreferrer"
        >
          <i className="ri-instagram-line"></i>
        </a>
        <a
          href="https://www.linkedin.com/in/guilherme-rezende-518297235/"
          target="_blank"
          rel="noreferrer"
        >
          <i className="ri-linkedin-line"></i>
        </a>
        <p>rezendeguilherme733@gmail.com</p>
      </div>
    </footer>
  );
}

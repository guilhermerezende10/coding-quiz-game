import { useState, useEffect } from "react";
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

const difficulty = ["Easy", "Medium", "Hard"];

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categories.at(0));
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    difficulty.at(0)
  );
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [rightAnswersCounter, setRightAnswersCounter] = useState(0);
  const [finishedQuiz, setFinishedQuiz] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (quizStarted) {
      setQuestions([]);
      fetchQuiz(
        selectedCategory,
        setQuestions,
        selectedDifficulty,
        setIsLoading
      );
    }
  }, [quizStarted, selectedCategory, selectedDifficulty]);

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
    setFinishedQuiz(false);
    setRightAnswersCounter(0)
  }

  return (
    <div className="App">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/3.5.0/remixicon.min.css"
      ></link>
      <Title />
      {questions.length === 0 && !finishedQuiz && !isLoading && (
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
      {isLoading && <Loader />}
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

      {finishedQuiz && (
        <ResultQuiz score={rightAnswersCounter} onPlayAgain={playAgain} />
      )}

      <Footer />
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
  return (
    <>
      <h2 className="welcome">Welcome to the</h2>
      <h1 className="title">📝 Coding Quiz Game</h1>;
    </>
  );
}

function Subtitle() {
  return <h2 className="subtitle">🤔 Choose your Quiz's Category</h2>;
}

async function fetchQuiz(
  category,
  setQuestions,
  selectedDifficulty,
  setIsLoading
) {
  console.log(category);
  const url = "https://quizapi.io/api/v1/questions";

  try {
    setIsLoading(true);
    const res = await fetch(
      `${url}?apiKey=${API_KEY}&limit=10&category=${category}&difficulty=${selectedDifficulty}`
    );

    if (!res.ok) throw new Error(`Something went wrong. Try again later.`);

    const data = await res.json();

    console.log(data);

    if (data.Response === "False") throw new Error("Questions not found");

    setQuestions(data);
  } catch (err) {
    console.error(err);
    setQuestions([]);
  } finally {
    setIsLoading(false);
  }
}

function CategoriesBox({ children }) {
  return <div className="quiz-categories">{children}</div>;
}

function SelectedElement({ selectedElement }) {
  return (
    <option value={selectedElement} className="selectedElement">
      {selectedElement}
    </option>
  );
}

function SelectQuiz({ setSelectedItem, arr }) {
  return (
    <select
      className="list-elements"
      onChange={(e) => setSelectedItem(e.target.value)}
    >
      {arr.map((element) => (
        <SelectedElement selectedElement={element} key={element} />
      ))}
    </select>
  );
}

function ButtonCategories({
  selectedCategory,
  questions,
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

function ResultQuiz({ score, onPlayAgain }) {
  return (
    <div className="result-box">
      <h3 className="result-score">Your Score: {score}</h3>
      <button className="result-btn" onClick={onPlayAgain}>
        Play again
      </button>
    </div>
  );
}

function Loader() {
  return <div className="loader"></div>;
}

function Footer() {
  return (
    <footer class="container">
      <div class="socials">
        <span>
          Made by <strong>Guilherme Rezende</strong>
        </span>
        <a
          href="https://github.com/guilhermerezende10"
          target="_blank"
          rel="noreferrer"
        >
          <i class="ri-github-line"></i>
        </a>
        <a
          href="https://www.instagram.com/guilhermerezende.10/"
          target="_blank"
          rel="noreferrer"
        >
          <i class="ri-instagram-line"></i>
        </a>
        <a
          href="https://www.linkedin.com/in/guilherme-rezende-518297235/"
          target="_blank"
          rel="noreferrer"
        >
          <i class="ri-linkedin-line"></i>
        </a>
        <p>rezendeguilherme733@gmail.com</p>

      </div>
    </footer>
  );
}

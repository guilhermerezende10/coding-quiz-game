// Import required hooks, styles and components
import { useState, useEffect } from "react";

import "./styles.css";

import { Footer } from "./components/Footer";
import { ResultQuiz } from "./components/ResultQuiz";
import { Loader } from "./components/Loader";
import { Title } from "./components/Header";

import { ButtonCategories } from "./components/Categories";
import { Subtitle } from "./components/Categories";
import { CategoriesBox } from "./components/Categories";
import { SelectQuiz } from "./components/Categories";

import { QuestionFooter } from "./components/Question";
import { QuestionAnswersList } from "./components/Question";
import { QuestionHeader } from "./components/Question";
import { DisplayQuestions } from "./components/Question";

// API key for fetching quiz data
const API_KEY = "2Um4w0zjk1qtARGXcoFU6zNqliZrfkGPECVjHmjc";

// Available quiz categories
const categories = [
  "Any",
  "Apache Kafka",
  "bash",
  "cPanel",
  "Code",
  "DevOps",
  "Django",
  "Docker",
  "Laravel",
  "Linux",
  "Next.js",
  "NodeJs",
  "Postgres",
  "React",
  "SQL",
  "VueJS",
  "WordPress",
];

// Quiz difficulty levels
const difficulty = ["Any", "Easy", "Medium", "Hard"];

// Utility function to fetch quiz data
export async function fetchQuiz(
  category,
  setQuestions,
  selectedDifficulty,
  setIsLoading
) {
  const url = "https://quizapi.io/api/v1/questions";
  try {
    setIsLoading(true); // Show loader during fetch
    const resCategory = category !== "Any" ? `&category=${category}` : "";
    const resDificculty =
      selectedDifficulty !== "Any" ? `&difficulty=${selectedDifficulty}` : "";
    const res = await fetch(
      `${url}?apiKey=${API_KEY}&limit=10${resCategory}${resDificculty}`
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
        <ResultQuiz
          score={rightAnswersCounter}
          onPlayAgain={resetQuiz}
          questionNumber={questionNumber}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

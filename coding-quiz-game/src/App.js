import { useState } from "react";
import "./styles.css";

const API_KEY = "2Um4w0zjk1qtARGXcoFU6zNqliZrfkGPECVjHmjc";

const categories = [
  "React",
  "JS",
  "Python",
  "PHP",
  "Cloud",
  "Networking",
  "DevOps",
  "Linux",
];

export default function App() {
  return (
    <div className="App">
      <h1 className="title">Coding Quiz Game</h1>
      <QueryOptions />
    </div>
  );
}

async function fetchQuiz(category) {
  console.log(category);
  const url = "https://quizapi.io/api/v1/questions";
  const params = new URLSearchParams({
    API_KEY,
    limit: "10",
    category: category,
  });

  try {
    const data = await fetch(`${url}?${params.toString()}`, {
      method: "GET",
    });
    const res = await data.json();
    console.log(res);

    if (!res.ok) throw new Error(`Something went wrong. Try again later.`);
  } catch (err) {
    console.error(err);
  }
}

function QueryOptions() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  return (
    <div className="quiz-categories">
      <h2 className="subtitle">Choose your quiz's category</h2>
      <select
        className="list-categories"
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map((category) => (
          <Category category={category} key={category} />
        ))}
      </select>
      <button
        className="btn-categories"
        onClick={() => fetchQuiz(selectedCategory)}
      >
        Choose
      </button>
    </div>
  );
}

function Category({ category }) {
  return (
    <option value={category} className="category">
      {category}
    </option>
  );
}

export function SelectQuiz({ setSelectedItem, arr }) {
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

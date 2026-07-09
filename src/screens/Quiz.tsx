import { useState } from "react";
import { QUIZ_QUESTIONS, type QuizQuestion } from "../data/quiz";

function shuffled(): QuizQuestion[] {
  const arr = [...QUIZ_QUESTIONS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Quiz() {
  const [deck, setDeck] = useState<QuizQuestion[]>(() => shuffled());
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const question = deck[index];
  const isLast = index === deck.length - 1;

  function pickAnswer(i: number) {
    if (selected !== null) return;
    setSelected(i);
  }

  function next() {
    if (isLast) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  function playAgain() {
    setDeck(shuffled());
    setIndex(0);
    setSelected(null);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="screen quiz-screen">
        <h2>🧠 Rejse-quiz</h2>
        <div className="quiz-done-card">
          <p className="quiz-done-emoji">🎉</p>
          <p className="quiz-done-text">I har været igennem alle {deck.length} spørgsmål!</p>
          <button className="big-button primary" onClick={playAgain}>
            🔄 Prøv igen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen quiz-screen">
      <h2>🧠 Rejse-quiz</h2>
      <p className="quiz-progress">
        Spørgsmål {index + 1} af {deck.length}
      </p>

      <div className="quiz-card">
        <p className="quiz-question">
          {question.emoji} {question.question}
        </p>
        <div className="quiz-options">
          {question.options.map((option, i) => {
            let optionClass = "quiz-option";
            if (selected !== null) {
              if (i === question.correctIndex) optionClass += " correct";
              else if (i === selected) optionClass += " wrong";
              else optionClass += " faded";
            }
            return (
              <button key={i} className={optionClass} onClick={() => pickAnswer(i)} disabled={selected !== null}>
                {option}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <p className={`quiz-feedback ${selected === question.correctIndex ? "correct" : "wrong"}`}>
            {selected === question.correctIndex ? "✅ Rigtigt!" : "❌ Ikke helt — men se det rigtige svar herover!"}
          </p>
        )}

        {selected !== null && (
          <button className="big-button primary" onClick={next}>
            {isLast ? "Se resultat" : "Næste spørgsmål ➜"}
          </button>
        )}
      </div>
    </div>
  );
}

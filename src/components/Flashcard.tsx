import { useState } from "react";

interface FlashcardProps {
  question: string;
  answer: string;
}

export default function Flashcard({ question, answer }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="w-full max-w-md mx-auto h-64 perspective cursor-pointer"
      onClick={handleFlip}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleFlip();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Flashcard: ${question}`}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
      >
        <div className="absolute w-full h-full backface-hidden bg-white border-2 border-gray-200 rounded-xl p-6 flex flex-col justify-center items-center shadow-lg">
          <h3 className="text-xl font-bold text-gray-800">Question</h3>
          <p className="text-lg text-center mt-4">{question}</p>
        </div>

        <div className="absolute w-full h-full backface-hidden bg-white border-2 border-gray-200 rounded-xl p-6 flex flex-col justify-center items-center shadow-lg rotate-y-180">
          <h3 className="text-xl font-bold text-gray-800">Answer</h3>
          <p className="text-lg text-center mt-4">{answer}</p>
        </div>
      </div>
    </div>
  );
}

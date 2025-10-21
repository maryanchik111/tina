"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Question = {
  question: string;
  options: string[];
  correct: number;
};

export default function Home() {
  const [showImage, setShowImage] = useState(true);
  const [stage, setStage] = useState<"question" | "no" | "quiz" | "find" | "done" | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");

  // для підказки
  const [hintStage, setHintStage] = useState<"locked" | "question" | "shown" | null>(null);
  const [hintInput, setHintInput] = useState("");

  const correctPhrase = "ТІШКА ТОП";

  const randomText1 = "опваплапалвдалвдлолваплвалвдопалаловдоалваорлваолваовлаовавлтішкаоавалвоаволаовроарваорвоавравоавававававававававаорправоаовадла";
  const randomText2 = "олвпавлаоалвдптоплавдолвдпаопвлдпвлоаовларворадіароваовалвраовавдаолроварвоаалаоварваовлаовлавлавпроавдалрпваровавоаврлалваавора";

  const questions: Question[] = [
    { question: "Столиця Франції?", options: ["Берлін", "Париж", "Рим", "Прага"], correct: 1 },
    { question: "Хто написав «Кобзар»?", options: ["Іван Франко", "Леся Українка", "Тарас Шевченко", "Григорій Сковорода"], correct: 2 },
    { question: "Яка хімічна формула води?", options: ["H₂O", "CO₂", "O₂", "NaCl"], correct: 0 },
    { question: "У якому році почалася Друга світова війна?", options: ["1935", "1939", "1941", "1945"], correct: 1 },
    { question: "Який океан найбільший на Землі?", options: ["Індійський", "Північний Льодовитий", "Атлантичний", "Тихий"], correct: 3 },
  ];

  // питання для підказки
  const hintQuestion = {
    question: "шо кажуть, коли спішать?",
    correctAnswer: "бистрєє", // сюди додаш свою правильну відповідь
  };

  const sendTelegramMessage = async (text: string) => {
    try {
      await fetch("/api/tg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
    } catch (err) {
      console.error("Помилка відправки в Telegram:", err);
    }
  };

  // стартова картинка
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImage(false);
      setStage("question");
      sendTelegramMessage("Користувач відкрив сайт 🌐");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // відповіді на тест
  const handleAnswer = (index: number) => {
    const correct = questions[currentQuestion].correct;
    if (index === correct) setScore((prev) => prev + 1);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      if (score + 1 === questions.length) setStage("find");
      else setStage("no");
    }
  };

  // перевірка фрази
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().toUpperCase() === correctPhrase) {
      setStage("done");
      sendTelegramMessage("Користувач пройшов гру ✅");
    } else {
      alert("не угадала");
      setInput("");
    }
  };

  // перевірка відповіді на підказку
  const handleHintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hintInput.trim().toLowerCase() === hintQuestion.correctAnswer.toLowerCase()) {
      setHintStage("shown");
      sendTelegramMessage("Користувач отримав підказку 💡");
    } else {
      alert("Невірна відповідь, спробуй ще раз!");
      setHintInput("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      {showImage ? (
        <Image src="/images.jpeg" alt="Loading image" width={400} height={400} className="object-contain" />
      ) : stage === "question" ? (
        <div>
          <p className="text-2xl mb-6">Хочеш дізнатися більше?</p>
          <p>all of the stars have a reason</p>
          <p>a reasonto shine, a reason like yours</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => setStage("quiz")} className="bg-green-500 text-white px-6 py-2 rounded-2xl hover:bg-green-600 transition">Так</button>
            <button onClick={() => setStage("no")} className="bg-gray-400 text-white px-6 py-2 rounded-2xl hover:bg-gray-500 transition">Ні</button>
          </div>
        </div>
      ) : stage === "no" ? (
        <p className="text-xl text-gray-700">ок</p>
      ) : stage === "quiz" ? (
        <div className="max-w-md">
          <p className="text-xl mb-4">{questions[currentQuestion].question}</p>
          <div className="flex flex-col gap-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button key={index} onClick={() => handleAnswer(index)} className="border border-gray-400 px-4 py-2 rounded-xl hover:bg-blue-100 transition">{option}</button>
            ))}
          </div>
          <p className="mt-4 text-gray-500 text-sm">Питання {currentQuestion + 1} з {questions.length}</p>
        </div>
      ) : stage === "find" ? (
        <div className="max-w-md">
          <p className="text-xl mb-4">🔍 Знайди приховані слова серед хаосу букв:</p>
          <div className="rounded-2xl px-4 font-mono break-words">{randomText1}</div>
          <div className="rounded-2xl px-4 font-mono break-words mb-6">{randomText2}</div>

          <form onSubmit={handleSubmit} className="flex gap-2 justify-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Введи фразу повністю..."
              className="border border-gray-300 rounded-xl px-4 py-2 w-60 focus:outline-none focus:border-green-500"
            />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition">OK</button>
          </form>
        </div>
      ) : stage === "done" ? (
        <div className="text-2xl font-bold text-green-600 flex flex-col items-center gap-4">
          🎉 ТІШКА ТОП!
          <p className="text-gray-600 mt-2">окак, а ти смишльонна</p>
          <p className="text-gray-600">але на цьому ігра не окончена, сорі</p>
          <p className="text-gray-600 mt-2">наступна ігра буде 22 жовтня</p>

          {hintStage !== "shown" && (
              <div className="flex flex-col items-center mt-4">
                <button
                  onClick={() => setHintStage("question")}
                  className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                >
                  <Image src="/minion.svg" alt="Minion hint" width={40} height={40} />
                </button>
                <p className="mt-2 text-gray-700 text-sm">відкрити підказку</p>
              </div>
            )}


          {hintStage === "question" && (
            <form onSubmit={handleHintSubmit} className="mt-4 flex flex-col items-center gap-2 max-w-md">
              <p className="text-lg mb-2">{hintQuestion.question}</p>
              <input
                type="text"
                value={hintInput}
                onChange={(e) => setHintInput(e.target.value)}
                placeholder="Введи відповідь..."
                className="border border-gray-300 rounded-xl px-4 py-2 w-60 focus:outline-none focus:border-yellow-500"
              />
              <button type="submit" className="bg-yellow-400 text-white px-4 py-2 rounded-xl hover:bg-yellow-500 transition">OK</button>
            </form>
          )}

          {hintStage === "shown" && (
            <div className="mt-4 p-4 bg-yellow-100 rounded-xl max-w-md">
              <p className="text-gray-700">окак</p>
              <p className="text-gray-700">ок, як домовлялись</p>
              <p className="text-gray-700">ти вже її бачила</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { data } from "./data";
import "./App.css";

function shuffleArray(array) {
  // Fisher-Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function Main() {
  const [showScore, setShowScore] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [userAnswers, setUserAnswers] = useState(Array(data.length).fill(''));
  const [timeLeft, setTimeLeft] = useState(5); // Initial time left

  // Shuffle the data array when component mounts
  useEffect(() => {
    shuffleData();
  }, []);

  // Function to shuffle data array
  function shuffleData() {
    const shuffledData = shuffleArray(data);
    setQuestionNumber(0);
    setUserAnswers(Array(data.length).fill(''));
    setShowScore(false);
  }

  // Function to calculate score
  function calculateScore() {
    let score = 0;
    for (let i = 0; i < data.length; i++) {
      if (userAnswers[i] === data[i].answer) {
        score++;
      }
    }
    return score;
  }

  // useEffect to handle timer and display score at the end
  useEffect(() => {
    // Set interval to update timer every second
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else {
        if (questionNumber < data.length - 1) {
          setQuestionNumber(questionNumber + 1); // Move to the next question
          setTimeLeft(5); // Reset the timer for the next question
        } else {
          clearInterval(timer); // Stop the timer
          setShowScore(true); // Show the total score
        }
      }
    }, 1000);

    // Clean up the interval when component unmounts or question changes
    return () => clearInterval(timer);
  }, [timeLeft, questionNumber]);

  // Function to handle option selection
  function handleOptionSelect(option) {
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[questionNumber] = option;
    setUserAnswers(updatedUserAnswers);
    setSelectedOption(option);
  }

  // useEffect to clear the previously selected option when question changes
  useEffect(() => {
    setSelectedOption('');
  }, [questionNumber]);

  return (
    <>
      <div className="timer">{timeLeft} seconds left</div>
      {showScore && (
        <div id="score">
          <h3>
            You have scored {calculateScore()} out of {data.length}
          </h3>
        </div>
      )}
      {!showScore && (
        <div id="quiz">
          <h3>{data[questionNumber].question}</h3>
          <div className="options">
            {data[questionNumber].options.map((option, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="opt"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => handleOptionSelect(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Main;

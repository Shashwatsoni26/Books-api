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
  const [timeLeft, setTimeLeft] = useState(null); // Change initial value to null
  const [userName, setUserName] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);

  // Shuffle the data array when component mounts
  useEffect(() => {
    shuffleData();
  }, []);

  saveToLocalStorage()

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

  // Function to save user data to local storage
  function saveToLocalStorage() {
    const quizData = {
      name: userName,
      score: calculateScore(),
      dateTime: new Date().toLocaleString()
    };
    localStorage.setItem('quizData', JSON.stringify(quizData));
  }

  // useEffect to handle timer and display score at the end
  useEffect(() => {
    if (timeLeft === null || !quizStarted) return; // Return if timeLeft is null or quiz hasn't started

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
  }, [timeLeft, questionNumber, quizStarted]);

  // Function to handle option selection
  function handleOptionSelect(option) {
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[questionNumber] = option;
    setUserAnswers(updatedUserAnswers);
    setSelectedOption(option);
  }

  // Function to handle quiz start
  function handleQuizStart() {
    if (userName.trim() === '') {
      alert('Please enter your name to start the quiz.');
      return;
    }
    setQuizStarted(true);
    setTimeLeft(5); // Start the timer after quiz starts
  }

  // Function to handle user name input
  function handleNameChange(event) {
    setUserName(event.target.value);
  }

  return (
    <>
      {!quizStarted && (
        <div id="start">
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={handleNameChange}
          />
          <button onClick={handleQuizStart} disabled={!userName.trim()}>Start Quiz</button>
        </div>
      )}
      {quizStarted && (
        <>
          <div className="timer">{timeLeft !== null ? `${timeLeft} seconds left` : ''}</div>
          {showScore && (
            <div id="score">
              <h3>
                {userName}, you have scored {calculateScore()} out of {data.length}
              </h3>
            </div>
          )}
          {!showScore && (
            <div id="quiz">
              {data[questionNumber].image && (
                <img src={data[questionNumber].image} alt="Question" />
              )}
              <h3>{data[questionNumber].question}</h3>
              <div className="options">
                {data[questionNumber].options.map((option, index) => (
                  <label key={index}>
                    {option.image ? (
                      <div className="image-option" onClick={() => handleOptionSelect(option.text)}>
                        <img src={option.image} alt={`Option ${index}`} />
                      </div>
                    ) : (
                      <>
                        <input
                          type="radio"
                          name="opt"
                          value={option}
                          checked={selectedOption === option}
                          onChange={() => handleOptionSelect(option)}
                        />
                        <span>{option}</span>
                      </>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Main;

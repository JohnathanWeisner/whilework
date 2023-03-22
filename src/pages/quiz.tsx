import React from "react";
import { Questions } from "@/interfaces/questions";
import { QuizState } from "@/interfaces/quiz";
import Timer from "@/components/timer";
import styles from "@/styles/Home.module.scss";

interface QuizProps {
  questions: Questions;
  quizState: QuizState;
  onAnswerSelected: (questionIndex: number, answerIndex: number) => void;
  onTimeOut: () => void;
}

export default function Quiz({
  questions,
  quizState,
  onAnswerSelected,
  onTimeOut,
}: QuizProps) {
  return (
    <div>
      {questions?.map((question, questionIndex) => {
        return (
          <div key={question.question}>
            <div>{question.question}</div>
            <div className={styles.answers}>
              {question.answers.map((answer, answerIndex) => {
                return (
                  <label key={`${question}-${questionIndex}-${answerIndex}`}>
                    <input
                      type="radio"
                      value={answer}
                      name={`${question}-${questionIndex}-${answerIndex}`}
                      checked={
                        quizState.answersSelected[questionIndex] === answerIndex
                      }
                      onChange={() =>
                        onAnswerSelected(questionIndex, answerIndex)
                      }
                    />
                    <span className={styles.answerLabel}>{answer}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
      <Timer
        isTimerPaused={quizState.isTimerPaused}
        onTimeOut={onTimeOut}
        maxTimeMs={30000}
      />
    </div>
  );
}

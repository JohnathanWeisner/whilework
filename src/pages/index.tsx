import Head from "next/head";
import { useReducer, useEffect } from "react";
import styles from "@/styles/Home.module.scss";
import { QuizStatus, QuizState, AnswerSelected } from "@/interfaces/quiz";
import Quiz from "./quiz";
import useQuestions from "@/queries/useQuestions";
import { Questions } from "@/interfaces/questions";

type Action =
  | { type: "quiz_start" }
  | { type: "initialize_questions_state"; value: number }
  | { type: "select_answer"; questionIndex: number; answerIndex: number }
  | { type: "time_out" };

function reducer(quizState: QuizState, action: Action) {
  if (action.type === "quiz_start") {
    return {
      ...quizState,
      status: QuizStatus.started,
      isTimerPaused: false,
    };
  }

  if (action.type === "initialize_questions_state" && action.value) {
    return {
      ...quizState,
      answersSelected: new Array(action.value).fill(null),
    };
  }

  if (action.type === "select_answer") {
    const newAnswers = [...quizState.answersSelected];
    newAnswers[action.questionIndex] = action.answerIndex;

    return {
      ...quizState,
      status: !newAnswers.includes(null)
        ? QuizStatus.completed
        : quizState.status,
      answersSelected: newAnswers,
    };
  }

  if (action.type === "time_out") {
    return {
      ...quizState,
      status: QuizStatus.completed,
    };
  }

  return { ...quizState };
}

const getTotalCorrect = (
  questions: Questions,
  answersSelected: AnswerSelected[]
) => {
  let totalAnswersCorrect = 0;

  for (
    let questionIndex = 0;
    questionIndex < questions.length;
    questionIndex++
  ) {
    if (
      questions[questionIndex].correct_index === answersSelected[questionIndex]
    ) {
      totalAnswersCorrect += 1;
    }
  }

  return totalAnswersCorrect;
};

const initialQuizState: QuizState = {
  status: QuizStatus.initial,
  answersSelected: [],
  isTimerPaused: true,
};

export default function Home() {
  const { isLoading, error, data: questions } = useQuestions();

  const [quizState, dispatch] = useReducer(reducer, initialQuizState);

  useEffect(() => {
    if (questions) {
      dispatch({ type: "initialize_questions_state", value: questions.length });
    }
  }, [questions]);

  const onStartQuizClick = () => {
    dispatch({ type: "quiz_start" });
  };

  const onAnswerSelected = (questionIndex: number, answerIndex: number) => {
    dispatch({ type: "select_answer", questionIndex, answerIndex });
  };

  const onTimeOut = () => {
    dispatch({ type: "time_out" });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!questions) {
    return <div>No questions</div>;
  }

  return (
    <>
      <Head>
        <title>WorkWhile</title>
        <meta name="description" content="WorkWhile On-site Interview" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Worker Quiz</h1>
        <div className={styles.container}>
          {quizState.status === QuizStatus.initial && (
            <button onClick={onStartQuizClick}>Start Quiz</button>
          )}
          {quizState.status === QuizStatus.started && (
            <Quiz
              questions={questions}
              quizState={quizState}
              onAnswerSelected={onAnswerSelected}
              onTimeOut={onTimeOut}
            />
          )}
          {quizState.status === QuizStatus.completed && (
            <div>
              <h2>Quiz Completed</h2>
              <p>
                Total Answers Correct:{" "}
                {getTotalCorrect(questions, quizState.answersSelected)}{" "}
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

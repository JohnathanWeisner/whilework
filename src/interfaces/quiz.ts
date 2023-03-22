export enum QuizStatus {
  initial = "initial",
  started = "started",
  completed = "completed",
}

export type AnswerSelected = number | null;

export interface QuizState {
  status: QuizStatus;
  answersSelected: AnswerSelected[];
  isTimerPaused: boolean;
}

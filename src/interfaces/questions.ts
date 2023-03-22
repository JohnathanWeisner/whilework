export interface Question {
  question: string;
  answers: string[];
  correct_index: number;
}

export type Questions = Question[];

import { useQuery } from "react-query";

import { Questions } from "@/interfaces/questions";

export default function useQuestions() {
  return useQuery<Questions, { message: string }>("questions", async () => {
    const response = await fetch(
      "http://interview.workwhilejobs.com/quiz/questions"
    );
    return await response.json();
  });
}

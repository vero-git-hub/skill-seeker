// utils/types.ts
export type PageProps = {
  setPage: (page: string) => void;
}

export type Question = {
  question: string;
  answers: string[];
  correct: string;
  requiredSpecialist: string;
};
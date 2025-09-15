import { faker } from "@faker-js/faker";
import type { Job } from "../../../jobs/types";
import type {
  Assessment,
  AssessmentSection,
  AssessmentQuestion,
} from "../../../assessments/types";
import { generateId, randomPick, randomPickMultiple } from "./utils";

const ASSESSMENT_TITLES = [
  "Technical Skills Assessment",
  "Problem Solving Challenge",
  "Cultural Fit Interview",
  "Coding Challenge",
  "Design Portfolio Review",
];

const QUESTION_TITLES = [
  "What is your experience with React?",
  "How do you handle state management?",
  "Describe a challenging project you worked on",
  "What is your approach to testing?",
  "How do you ensure code quality?",
  "What is your experience with version control?",
  "How do you handle performance optimization?",
  "Describe your experience with APIs",
  "What is your approach to debugging?",
  "How do you stay updated with new technologies?",
  "What is your experience with databases?",
  "How do you handle team collaboration?",
  "What is your experience with cloud platforms?",
  "How do you approach security in development?",
  "What is your experience with CI/CD?",
];

const QUESTION_OPTIONS = [
  ["Excellent", "Good", "Fair", "Poor"],
  ["Yes", "No", "Sometimes", "Not sure"],
  ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"],
  ["1-2 years", "3-5 years", "5-10 years", "10+ years"],
  ["Daily", "Weekly", "Monthly", "Rarely", "Never"],
];

// Generate assessments
export const generateAssessments = (jobs: Job[]): Assessment[] => {
  const assessments: Assessment[] = [];
  const selectedJobs = randomPickMultiple(jobs, 3); // 3 assessments for different jobs

  selectedJobs.forEach((job) => {
    const sections: AssessmentSection[] = [];
    const sectionCount = Math.floor(Math.random() * 3) + 2; // 2-4 sections

    for (let sectionIndex = 0; sectionIndex < sectionCount; sectionIndex++) {
      const questions: AssessmentQuestion[] = [];
      const questionCount = Math.floor(Math.random() * 5) + 3; // 3-7 questions per section

      for (
        let questionIndex = 0;
        questionIndex < questionCount;
        questionIndex++
      ) {
        const questionTypes = [
          "single-choice",
          "multi-choice",
          "short-text",
          "long-text",
          "numeric",
        ];
        const questionType = randomPick(
          questionTypes
        ) as AssessmentQuestion["type"];

        const question: AssessmentQuestion = {
          id: generateId(),
          sectionId: generateId(), // Will be updated after section creation
          type: questionType,
          title: randomPick(QUESTION_TITLES),
          description: Math.random() < 0.5 ? faker.lorem.sentence() : undefined,
          order: questionIndex + 1,
          isRequired: Math.random() < 0.8,
          validation:
            questionType === "numeric"
              ? {
                  min: Math.floor(Math.random() * 10),
                  max: Math.floor(Math.random() * 100) + 50,
                }
              : questionType === "short-text"
              ? {
                  minLength: 10,
                  maxLength: 200,
                }
              : questionType === "long-text"
              ? {
                  minLength: 50,
                  maxLength: 1000,
                }
              : undefined,
          options: ["single-choice", "multi-choice"].includes(questionType)
            ? randomPick(QUESTION_OPTIONS).map((option, index) => ({
                id: generateId(),
                label: option,
                value: option.toLowerCase().replace(/\s+/g, "-"),
                order: index + 1,
              }))
            : undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        questions.push(question);
      }

      const sectionId = generateId();
      const section: AssessmentSection = {
        id: sectionId,
        assessmentId: generateId(), // Will be updated after assessment creation
        title: faker.lorem.words(2),
        description: faker.lorem.sentence(),
        order: sectionIndex + 1,
        questions: questions.map((q) => ({ ...q, sectionId })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      sections.push(section);
    }

    const assessmentId = generateId();
    const assessment: Assessment = {
      id: assessmentId,
      jobId: job.id,
      title: randomPick(ASSESSMENT_TITLES),
      description: faker.lorem.paragraph(),
      sections: sections.map((s) => ({ ...s, assessmentId })),
      isActive: Math.random() < 0.8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    assessments.push(assessment);
  });

  return assessments;
};

import { faker } from "@faker-js/faker";
import type { Job } from "../../../jobs/types";
import type {
  Candidate,
  CandidateNote,
  CandidateTimelineEvent,
} from "../../../candidates/types";
import { generateId, randomDate, randomPick, generateEmail } from "./utils";

const CANDIDATE_STAGES = [
  "applied",
  "screen",
  "tech",
  "offer",
  "hired",
  "rejected",
];

// Generate candidates
export const generateCandidates = (jobs: Job[]): Candidate[] => {
  const candidates: Candidate[] = [];
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  const endDate = new Date();

  for (let i = 0; i < 1000; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const email = generateEmail(firstName, lastName);
    const job = randomPick(jobs);
    const stage = randomPick(CANDIDATE_STAGES) as Candidate["stage"];
    const createdAt = randomDate(startDate, endDate);
    const updatedAt = randomDate(createdAt, endDate);

    candidates.push({
      id: generateId(),
      name,
      email,
      phone: Math.random() < 0.8 ? faker.phone.number() : undefined,
      stage,
      jobId: job.id,
      resume:
        Math.random() < 0.6
          ? `https://resume.example.com/${firstName.toLowerCase()}-${lastName.toLowerCase()}.pdf`
          : undefined,
      linkedin:
        Math.random() < 0.7
          ? `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`
          : undefined,
      portfolio:
        Math.random() < 0.4
          ? `https://portfolio.example.com/${firstName.toLowerCase()}-${lastName.toLowerCase()}`
          : undefined,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
  }

  return candidates;
};

// Generate candidate notes
export const generateCandidateNotes = (
  candidates: Candidate[]
): CandidateNote[] => {
  const notes: CandidateNote[] = [];
  const authors = [
    "John Smith",
    "Sarah Johnson",
    "Mike Davis",
    "Lisa Wilson",
    "Tom Brown",
  ];

  const noteContents = [
    "Great communication skills during the interview",
    "Strong technical background, would be a good fit",
    "Needs more experience with our tech stack",
    "Excellent problem-solving approach",
    "Cultural fit seems good, team liked them",
    "Concerns about availability for the role",
    "Very enthusiastic about the position",
    "Previous experience is relevant",
    "Would benefit from additional training",
    "Strong portfolio and references",
  ];

  candidates.forEach((candidate) => {
    const noteCount = Math.floor(Math.random() * 3); // 0-2 notes per candidate
    for (let i = 0; i < noteCount; i++) {
      const createdAt = randomDate(new Date(candidate.createdAt), new Date());
      notes.push({
        id: generateId(),
        candidateId: candidate.id,
        content: randomPick(noteContents),
        author: randomPick(authors),
        mentions: Math.random() < 0.3 ? [randomPick(authors)] : undefined,
        createdAt: createdAt.toISOString(),
        updatedAt: createdAt.toISOString(),
      });
    }
  });

  return notes;
};

// Generate candidate timeline events
export const generateCandidateTimelineEvents = (
  candidates: Candidate[]
): CandidateTimelineEvent[] => {
  const events: CandidateTimelineEvent[] = [];
  const eventTypes = ["stage_change", "note_added", "assessment_completed"];
  const descriptions = [
    "Moved to screening stage",
    "Completed technical assessment",
    "Note added by recruiter",
    "Moved to technical interview",
    "Assessment submitted",
    "Moved to offer stage",
    "Note added by hiring manager",
    "Moved to final interview",
    "Assessment completed successfully",
    "Moved to rejected stage",
  ];

  candidates.forEach((candidate) => {
    const eventCount = Math.floor(Math.random() * 5) + 1; // 1-5 events per candidate
    for (let i = 0; i < eventCount; i++) {
      const createdAt = randomDate(new Date(candidate.createdAt), new Date());
      events.push({
        id: generateId(),
        candidateId: candidate.id,
        type: randomPick(eventTypes) as CandidateTimelineEvent["type"],
        description: randomPick(descriptions),
        metadata: {
          previousStage: i > 0 ? randomPick([...CANDIDATE_STAGES]) : undefined,
          newStage: candidate.stage,
          assessmentId: Math.random() < 0.3 ? generateId() : undefined,
        },
        createdAt: createdAt.toISOString(),
        updatedAt: createdAt.toISOString(),
      });
    }
  });

  return events;
};

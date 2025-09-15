import { generateJobs } from "./jobs";
import {
  generateCandidates,
  generateCandidateNotes,
  generateCandidateTimelineEvents,
} from "./candidates";
import { generateAssessments } from "./assessments";

// Main seed data generator
export const generateSeedData = () => {
  console.log("🌱 Generating seed data...");

  const jobs = generateJobs();
  const candidates = generateCandidates(jobs);
  const candidateNotes = generateCandidateNotes(candidates);
  const candidateTimelineEvents = generateCandidateTimelineEvents(candidates);
  const assessments = generateAssessments(jobs);

  console.log("✅ Seed data generated:", {
    jobs: jobs.length,
    candidates: candidates.length,
    candidateNotes: candidateNotes.length,
    candidateTimelineEvents: candidateTimelineEvents.length,
    assessments: assessments.length,
  });

  return {
    jobs,
    candidates,
    candidateNotes,
    candidateTimelineEvents,
    assessments,
  };
};

// Export individual generators for specific use cases
export { generateJobs } from "./jobs";
export {
  generateCandidates,
  generateCandidateNotes,
  generateCandidateTimelineEvents,
} from "./candidates";
export { generateAssessments } from "./assessments";
export * from "./utils";

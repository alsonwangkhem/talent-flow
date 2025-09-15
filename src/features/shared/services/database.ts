import Dexie from "dexie";
import type { Table } from "dexie";
import type { Job } from "../../jobs/types";
import type {
  Candidate,
  CandidateNote,
  CandidateTimelineEvent,
} from "../../candidates/types";
import type { Assessment, AssessmentResponse } from "../../assessments/types";
import { generateSeedData } from "./seedData/index";

export class TalentFlowDB extends Dexie {
  jobs!: Table<Job>;
  candidates!: Table<Candidate>;
  candidateNotes!: Table<CandidateNote>;
  candidateTimeline!: Table<CandidateTimelineEvent>;
  assessments!: Table<Assessment>;
  assessmentResponses!: Table<AssessmentResponse>;

  constructor() {
    super("TalentFlowDB");

    this.version(1).stores({
      jobs: "++id, title, slug, status, tags, order, createdAt, updatedAt",
      candidates:
        "++id, name, email, phone, stage, jobId, resume, linkedin, portfolio, createdAt, updatedAt",
      candidateNotes:
        "++id, candidateId, content, author, createdAt, updatedAt",
      candidateTimeline: "++id, candidateId, type, createdAt, updatedAt",
      assessments:
        "++id, jobId, title, sections, isActive, createdAt, updatedAt",
      assessmentResponses:
        "++id, candidateId, assessmentId, jobId, responses, completedAt, createdAt, updatedAt",
    });
  }
}

export const db = new TalentFlowDB();

// Database utilities
export const dbUtils = {
  async clearAllData() {
    await db.transaction(
      "rw",
      [
        db.jobs,
        db.candidates,
        db.candidateNotes,
        db.candidateTimeline,
        db.assessments,
        db.assessmentResponses,
      ],
      async () => {
        await Promise.all([
          db.jobs.clear(),
          db.candidates.clear(),
          db.candidateNotes.clear(),
          db.candidateTimeline.clear(),
          db.assessments.clear(),
          db.assessmentResponses.clear(),
        ]);
      }
    );
  },

  async seedData() {
    try {
      // Check if data already exists
      const existingJobs = await db.jobs.count();
      const existingCandidates = await db.candidates.count();
      const existingAssessments = await db.assessments.count();

      // Only seed if no data exists
      if (
        existingJobs === 0 &&
        existingCandidates === 0 &&
        existingAssessments === 0
      ) {
        console.log("🌱 No existing data found, seeding database...");
        const seedData = generateSeedData();

        // Store all data in IndexedDB
        await db.transaction(
          "rw",
          [
            db.jobs,
            db.candidates,
            db.candidateNotes,
            db.candidateTimeline,
            db.assessments,
            db.assessmentResponses,
          ],
          async () => {
            await db.jobs.bulkAdd(seedData.jobs);
            await db.candidates.bulkAdd(seedData.candidates);
            await db.candidateNotes.bulkAdd(seedData.candidateNotes);
            await db.candidateTimeline.bulkAdd(
              seedData.candidateTimelineEvents
            );
            await db.assessments.bulkAdd(seedData.assessments);
          }
        );

        console.log("✅ Database seeded successfully");
        return true;
      } else {
        console.log("📊 Existing data found, skipping seed");
        return false;
      }
    } catch (error) {
      console.error("❌ Failed to seed database:", error);
      throw error;
    }
  },

  async exportData() {
    return {
      jobs: await db.jobs.toArray(),
      candidates: await db.candidates.toArray(),
      candidateNotes: await db.candidateNotes.toArray(),
      candidateTimeline: await db.candidateTimeline.toArray(),
      assessments: await db.assessments.toArray(),
      assessmentResponses: await db.assessmentResponses.toArray(),
    };
  },

  async importData(data: {
    jobs?: Job[];
    candidates?: Candidate[];
    candidateNotes?: CandidateNote[];
    candidateTimeline?: CandidateTimelineEvent[];
    assessments?: Assessment[];
    assessmentResponses?: AssessmentResponse[];
  }) {
    await db.transaction(
      "rw",
      [
        db.jobs,
        db.candidates,
        db.candidateNotes,
        db.candidateTimeline,
        db.assessments,
        db.assessmentResponses,
      ],
      async () => {
        if (data.jobs) await db.jobs.bulkPut(data.jobs);
        if (data.candidates) await db.candidates.bulkPut(data.candidates);
        if (data.candidateNotes)
          await db.candidateNotes.bulkPut(data.candidateNotes);
        if (data.candidateTimeline)
          await db.candidateTimeline.bulkPut(data.candidateTimeline);
        if (data.assessments) await db.assessments.bulkPut(data.assessments);
        if (data.assessmentResponses)
          await db.assessmentResponses.bulkPut(data.assessmentResponses);
      }
    );
  },
};

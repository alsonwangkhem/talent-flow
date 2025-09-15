import { db, dbUtils } from "./database";
import type { Job } from "../../jobs/types";
import type {
  Candidate,
  CandidateNote,
  CandidateTimelineEvent,
} from "../../candidates/types";
import type { Assessment, AssessmentResponse } from "../../assessments/types";

export class DataPersistenceService {
  private static instance: DataPersistenceService;
  private isInitialized = false;

  static getInstance(): DataPersistenceService {
    if (!DataPersistenceService.instance) {
      DataPersistenceService.instance = new DataPersistenceService();
    }
    return DataPersistenceService.instance;
  }

  async initializeData(): Promise<void> {
    if (this.isInitialized) {
      return;
    }
    try {
      await dbUtils.seedData();
      this.isInitialized = true;
    } catch (error) {
      console.error("❌ Failed to initialize data:", error);
      throw error;
    }
  }

  async getJobs(): Promise<Job[]> {
    return await db.jobs.toArray();
  }

  async getCandidates(): Promise<Candidate[]> {
    return await db.candidates.toArray();
  }

  async getAssessments(): Promise<Assessment[]> {
    return await db.assessments.toArray();
  }

  async getCandidateNotes(candidateId: string): Promise<CandidateNote[]> {
    return await db.candidateNotes
      .where("candidateId")
      .equals(candidateId)
      .toArray();
  }

  async getCandidateTimeline(
    candidateId: string
  ): Promise<CandidateTimelineEvent[]> {
    return await db.candidateTimeline
      .where("candidateId")
      .equals(candidateId)
      .toArray();
  }

  async getAssessmentByJobId(jobId: string): Promise<Assessment | null> {
    const assessment = await db.assessments
      .where("jobId")
      .equals(jobId)
      .first();
    return assessment || null;
  }

  async saveJob(job: Job): Promise<void> {
    await db.jobs.put(job);
  }

  async saveCandidate(candidate: Candidate): Promise<void> {
    await db.candidates.put(candidate);
  }

  async saveAssessment(assessment: Assessment): Promise<void> {
    await db.assessments.put(assessment);
  }

  async saveCandidateNote(note: CandidateNote): Promise<void> {
    await db.candidateNotes.put(note);
  }

  async saveCandidateTimelineEvent(
    event: CandidateTimelineEvent
  ): Promise<void> {
    await db.candidateTimeline.put(event);
  }

  async saveAssessmentResponse(response: AssessmentResponse): Promise<void> {
    await db.assessmentResponses.put(response);
  }
}

export const dataPersistence = DataPersistenceService.getInstance();

import type { BaseEntity } from "../../shared/types";

export interface Candidate extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  stage: "applied" | "screen" | "tech" | "offer" | "hired" | "rejected";
  jobId: string;
  resume?: string;
  linkedin?: string;
  portfolio?: string;
  notes?: CandidateNote[];
}

export interface CandidateNote extends BaseEntity {
  candidateId: string;
  content: string;
  author: string;
  mentions?: string[];
}

export interface CandidateTimelineEvent extends BaseEntity {
  candidateId: string;
  type: "stage_change" | "note_added" | "assessment_completed";
  description: string;
  metadata?: Record<string, unknown>;
}

export interface CreateCandidateRequest {
  name: string;
  email: string;
  phone?: string;
  jobId: string;
  resume?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface UpdateCandidateRequest
  extends Partial<CreateCandidateRequest> {
  stage?: Candidate["stage"];
}

export interface CandidateFilters {
  search?: string;
  stage?: Candidate["stage"];
  jobId?: string;
}

export interface CandidateSearchConfig {
  query: string;
  fields: ("name" | "email")[];
}

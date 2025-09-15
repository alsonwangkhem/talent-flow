export const API_BASE_URL = "/api";

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

export const CANDIDATE_STAGES = [
  "applied",
  "screen",
  "tech",
  "offer",
  "hired",
  "rejected",
] as const;

export const JOB_STATUS = ["active", "archived"] as const;

export const QUESTION_TYPES = [
  "single-choice",
  "multi-choice",
  "short-text",
  "long-text",
  "numeric",
  "file-upload",
] as const;

export const ASSESSMENT_ARTIFICIAL_DELAY = {
  MIN: 200,
  MAX: 1200,
} as const;

export const ASSESSMENT_ERROR_RATE = 0.1; // 10%

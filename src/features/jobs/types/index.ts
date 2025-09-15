import type { BaseEntity } from "../../shared/types";

export interface Job extends BaseEntity {
  title: string;
  slug: string;
  status: "active" | "archived";
  tags: string[];
  order: number;
  description?: string;
  requirements?: string[];
  location?: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface CreateJobRequest {
  title: string;
  description?: string;
  requirements?: string[];
  location?: string;
  salary?: Job["salary"];
  tags: string[];
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {
  status?: Job["status"];
}

export interface JobFilters {
  search?: string;
  status?: Job["status"];
  tags?: string[];
}

export interface JobSortConfig {
  field: "title" | "createdAt" | "order";
  direction: "asc" | "desc";
}

export interface ReorderJobsRequest {
  fromOrder: number;
  toOrder: number;
}

// add jobId to ReorderJobsRequest
// min / max of salary can be optional
// tags can be stricter

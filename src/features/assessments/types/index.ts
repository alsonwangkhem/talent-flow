import type { BaseEntity } from "../../shared/types";

export interface Assessment extends BaseEntity {
  jobId: string;
  title: string;
  description?: string;
  sections: AssessmentSection[];
  isActive: boolean;
}

export interface AssessmentSection extends BaseEntity {
  assessmentId: string;
  title: string;
  description?: string;
  order: number;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion extends BaseEntity {
  sectionId: string;
  type:
    | "single-choice"
    | "multi-choice"
    | "short-text"
    | "long-text"
    | "numeric"
    | "file-upload";
  title: string;
  description?: string;
  order: number;
  isRequired: boolean;
  validation?: QuestionValidation;
  options?: QuestionOption[];
  conditional?: ConditionalLogic;
}

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
  order: number;
}

export interface QuestionValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  customRules?: ValidationRule[];
}

export interface ValidationRule {
  id: string;
  message: string;
  validator: (value: unknown) => boolean;
}

export interface ConditionalLogic {
  dependsOn: string; // question ID
  condition:
    | "equals"
    | "not-equals"
    | "contains"
    | "greater-than"
    | "less-than";
  value: unknown;
  show: boolean;
}

export interface AssessmentResponse extends BaseEntity {
  candidateId: string;
  assessmentId: string;
  jobId: string;
  responses: QuestionResponse[];
  completedAt?: string;
  score?: number;
}

export interface QuestionResponse {
  questionId: string;
  value: unknown;
  fileUrl?: string;
}

export interface CreateAssessmentRequest {
  jobId: string;
  title: string;
  description?: string;
}

export interface UpdateAssessmentRequest
  extends Partial<CreateAssessmentRequest> {
  isActive?: boolean;
}

export interface CreateSectionRequest {
  assessmentId: string;
  title: string;
  description?: string;
  order: number;
}

export interface CreateQuestionRequest {
  sectionId: string;
  type: AssessmentQuestion["type"];
  title: string;
  description?: string;
  order: number;
  isRequired: boolean;
  validation?: QuestionValidation;
  options?: Omit<QuestionOption, "id">[];
  conditional?: ConditionalLogic;
}

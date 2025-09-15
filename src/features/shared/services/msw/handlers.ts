import { http, HttpResponse } from "msw";
import {
  ASSESSMENT_ARTIFICIAL_DELAY,
  ASSESSMENT_ERROR_RATE,
} from "../../utils/constants";
import { dataPersistence } from "../dataPersistence";
import type { Job } from "../../../jobs/types";
import type { Candidate } from "../../../candidates/types";
import type { Assessment } from "../../../assessments/types";

// Helper functions for artificial delays and errors
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const randomDelay = () =>
  delay(
    Math.random() *
      (ASSESSMENT_ARTIFICIAL_DELAY.MAX - ASSESSMENT_ARTIFICIAL_DELAY.MIN) +
      ASSESSMENT_ARTIFICIAL_DELAY.MIN
  );

const shouldError = () => Math.random() < ASSESSMENT_ERROR_RATE;

export const handlers = [
  // Jobs API
  http.get("/jobs", async ({ request }) => {
    await randomDelay();

    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10");

    // Get jobs from IndexedDB
    const allJobs = await dataPersistence.getJobs();

    // Filter and sort logic
    const filteredJobs = allJobs.filter((job) => {
      const matchesSearch =
        !search || job.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !status || job.status === status;
      return matchesSearch && matchesStatus;
    });

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: paginatedJobs,
      total: filteredJobs.length,
      page,
      pageSize,
      hasNext: endIndex < filteredJobs.length,
      hasPrev: page > 1,
    });
  }),

  http.post("/jobs", async ({ request }) => {
    await randomDelay();

    if (shouldError()) {
      return HttpResponse.json(
        { message: "Failed to create job", code: "CREATE_JOB_FAILED" },
        { status: 500 }
      );
    }

    const body = (await request.json()) as Partial<Job>;
    const allJobs = await dataPersistence.getJobs();
    const newJob: Job = {
      id: crypto.randomUUID(),
      title: body.title || "",
      slug: body.title?.toLowerCase().replace(/\s+/g, "-") || "",
      status: "active",
      tags: body.tags || [],
      order: allJobs.length + 1,
      description: body.description,
      requirements: body.requirements,
      location: body.location,
      salary: body.salary,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to IndexedDB
    await dataPersistence.saveJob(newJob);

    return HttpResponse.json(newJob, { status: 201 });
  }),

  http.patch("/jobs/:id", async ({ request, params }) => {
    await randomDelay();

    if (shouldError()) {
      return HttpResponse.json(
        { message: "Failed to update job", code: "UPDATE_JOB_FAILED" },
        { status: 500 }
      );
    }

    const body = (await request.json()) as Partial<Job>;
    const jobId = params.id as string;

    // Find and update job from IndexedDB
    const allJobs = await dataPersistence.getJobs();
    const existingJob = allJobs.find((job) => job.id === jobId);

    if (!existingJob) {
      return HttpResponse.json(
        { message: "Job not found", code: "JOB_NOT_FOUND" },
        { status: 404 }
      );
    }

    const updatedJob: Job = {
      ...existingJob,
      ...body,
      id: jobId,
      updatedAt: new Date().toISOString(),
    };

    // Save updated job to IndexedDB
    await dataPersistence.saveJob(updatedJob);

    return HttpResponse.json(updatedJob);
  }),

  http.patch("/jobs/:id/reorder", async ({ request, params }) => {
    await randomDelay();

    if (shouldError()) {
      return HttpResponse.json(
        { message: "Failed to reorder jobs", code: "REORDER_JOBS_FAILED" },
        { status: 500 }
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const jobId = params.id as string;

    // Reorder logic would go here
    return HttpResponse.json({ success: true, jobId, ...body });
  }),

  // Candidates API
  http.get("/candidates", async ({ request }) => {
    await randomDelay();

    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const stage = url.searchParams.get("stage") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10");

    // Get candidates from IndexedDB
    const allCandidates = await dataPersistence.getCandidates();

    // Filter and pagination logic
    const filteredCandidates = allCandidates.filter((candidate) => {
      const matchesSearch =
        !search ||
        candidate.name.toLowerCase().includes(search.toLowerCase()) ||
        candidate.email.toLowerCase().includes(search.toLowerCase());
      const matchesStage = !stage || candidate.stage === stage;
      return matchesSearch && matchesStage;
    });

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: paginatedCandidates,
      total: filteredCandidates.length,
      page,
      pageSize,
      hasNext: endIndex < filteredCandidates.length,
      hasPrev: page > 1,
    });
  }),

  http.post("/candidates", async ({ request }) => {
    await randomDelay();

    if (shouldError()) {
      return HttpResponse.json(
        {
          message: "Failed to create candidate",
          code: "CREATE_CANDIDATE_FAILED",
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as Partial<Candidate>;
    const newCandidate: Candidate = {
      id: crypto.randomUUID(),
      name: body.name || "",
      email: body.email || "",
      phone: body.phone,
      stage: "applied",
      jobId: body.jobId || "",
      resume: body.resume,
      linkedin: body.linkedin,
      portfolio: body.portfolio,
      notes: body.notes,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to IndexedDB
    await dataPersistence.saveCandidate(newCandidate);

    return HttpResponse.json(newCandidate, { status: 201 });
  }),

  http.patch("/candidates/:id", async ({ request, params }) => {
    await randomDelay();

    if (shouldError()) {
      return HttpResponse.json(
        {
          message: "Failed to update candidate",
          code: "UPDATE_CANDIDATE_FAILED",
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as Partial<Candidate>;
    const candidateId = params.id as string;

    // Find and update candidate from IndexedDB
    const allCandidates = await dataPersistence.getCandidates();
    const existingCandidate = allCandidates.find(
      (candidate) => candidate.id === candidateId
    );

    if (!existingCandidate) {
      return HttpResponse.json(
        { message: "Candidate not found", code: "CANDIDATE_NOT_FOUND" },
        { status: 404 }
      );
    }

    const updatedCandidate: Candidate = {
      ...existingCandidate,
      ...body,
      id: candidateId,
      updatedAt: new Date().toISOString(),
    };

    // Save updated candidate to IndexedDB
    await dataPersistence.saveCandidate(updatedCandidate);

    return HttpResponse.json(updatedCandidate);
  }),

  http.get("/candidates/:id/timeline", async () => {
    await randomDelay();

    // Timeline logic would go here - will use candidateId when implementing
    const timeline: unknown[] = [];

    return HttpResponse.json(timeline);
  }),

  // Assessments API
  http.get("/assessments/:jobId", async ({ params }) => {
    await randomDelay();

    const jobId = params.jobId as string;

    // Find assessment for job from IndexedDB
    const assessment = await dataPersistence.getAssessmentByJobId(jobId);

    return HttpResponse.json(assessment);
  }),

  http.put("/assessments/:jobId", async ({ request, params }) => {
    await randomDelay();

    if (shouldError()) {
      return HttpResponse.json(
        {
          message: "Failed to save assessment",
          code: "SAVE_ASSESSMENT_FAILED",
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as Partial<Assessment>;
    const jobId = params.jobId as string;

    const assessment: Assessment = {
      id: crypto.randomUUID(),
      jobId,
      title: body.title || "",
      description: body.description,
      sections: body.sections || [],
      isActive: body.isActive ?? true,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(assessment);
  }),

  http.post("/assessments/:jobId/submit", async ({ request, params }) => {
    await randomDelay();

    if (shouldError()) {
      return HttpResponse.json(
        {
          message: "Failed to submit assessment",
          code: "SUBMIT_ASSESSMENT_FAILED",
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const jobId = params.jobId as string;

    const response = {
      id: crypto.randomUUID(),
      jobId,
      ...body,
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(response, { status: 201 });
  }),
];

import { useState, useEffect } from "react";
import { apiClient } from "./features/shared/services/apiClient";
import { dbUtils } from "./features/shared/services/database";
import { dataPersistence } from "./features/shared/services/dataPersistence";
import type { Job } from "./features/jobs/types";
import type { Candidate } from "./features/candidates/types";
import type { Assessment } from "./features/assessments/types";

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataStats, setDataStats] = useState({
    jobs: 0,
    candidates: 0,
    assessments: 0,
  });
  // Load data stats on component mount
  useEffect(() => {
    console.log("🔍 App component mounted, loading data stats...");
    loadDataStats();
  }, []);

  const loadDataStats = async () => {
    try {
      console.log("📊 Loading data stats from IndexedDB...");
      const [jobsData, candidatesData, assessmentsData] = await Promise.all([
        dataPersistence.getJobs(),
        dataPersistence.getCandidates(),
        dataPersistence.getAssessments(),
      ]);

      console.log("📊 Data loaded:", {
        jobs: jobsData.length,
        candidates: candidatesData.length,
        assessments: assessmentsData.length,
      });

      setDataStats({
        jobs: jobsData.length,
        candidates: candidatesData.length,
        assessments: assessmentsData.length,
      });
    } catch (error) {
      console.error("❌ Failed to load data stats:", error);
    }
  };

  const clearAndReseed = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("🗑️ Clearing existing data...");
      await dbUtils.clearAllData();

      console.log("🌱 Re-seeding data...");
      await dataPersistence.initializeData();

      console.log("📊 Loading fresh data...");
      await loadDataStats();

      console.log("✅ Data cleared and re-seeded successfully");
    } catch (error) {
      console.error("❌ Failed to clear and re-seed:", error);
      setError(
        error instanceof Error ? error.message : "Failed to clear and re-seed"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("📊 Loading sample data...");

      // Load jobs via API
      const jobsResponse = await apiClient.getPaginated<Job>("/jobs", {
        page: 1,
        pageSize: 5,
      });
      setJobs(jobsResponse.data);

      // Load candidates via API
      const candidatesResponse = await apiClient.getPaginated<Candidate>(
        "/candidates",
        {
          page: 1,
          pageSize: 5,
        }
      );
      setCandidates(candidatesResponse.data);

      // Load assessments directly
      const assessmentsData = await dataPersistence.getAssessments();
      setAssessments(assessmentsData.slice(0, 3));

      console.log("✅ Sample data loaded successfully!");
    } catch (error) {
      console.error("❌ Failed to load sample data:", error);
      setError(error instanceof Error ? error.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          🚀 TalentFlow - Data Seeding Test
        </h1>

        {/* Data Stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900">Jobs</h3>
            <p className="text-3xl font-bold text-blue-600">{dataStats.jobs}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900">Candidates</h3>
            <p className="text-3xl font-bold text-green-600">
              {dataStats.candidates}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900">Assessments</h3>
            <p className="text-3xl font-bold text-purple-600">
              {dataStats.assessments}
            </p>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={loadSampleData}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Loading..." : "Load Sample Data"}
          </button>

          <button
            onClick={clearAndReseed}
            disabled={loading}
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Processing..." : "Clear & Re-seed Data"}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">❌ Error: {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Jobs ({jobs.length})
            </h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-80 text-sm text-gray-700">
              {JSON.stringify(jobs, null, 2)}
            </pre>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Candidates ({candidates.length})
            </h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-80 text-sm text-gray-700">
              {JSON.stringify(candidates, null, 2)}
            </pre>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Assessments ({assessments.length})
            </h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-80 text-sm text-gray-700">
              {JSON.stringify(assessments, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

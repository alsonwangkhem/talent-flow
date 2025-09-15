import type { Job } from "../../../jobs/types";
import {
  generateId,
  randomDate,
  randomPick,
  randomPickMultiple,
  generateSlug,
  generateSalaryRange,
} from "./utils";

// Job titles and descriptions
const JOB_TITLES = [
  "Senior Frontend Developer",
  "Full Stack Engineer",
  "React Developer",
  "Node.js Backend Developer",
  "Python Developer",
  "DevOps Engineer",
  "UI/UX Designer",
  "Product Manager",
  "Data Scientist",
  "Machine Learning Engineer",
  "Mobile App Developer",
  "Cloud Architect",
  "Security Engineer",
  "QA Engineer",
  "Technical Writer",
  "Scrum Master",
  "Business Analyst",
  "Sales Engineer",
  "Customer Success Manager",
  "Marketing Manager",
  "Content Creator",
  "Graphic Designer",
  "Digital Marketing Specialist",
  "HR Business Partner",
  "Financial Analyst",
];

const JOB_DESCRIPTIONS = [
  "We are looking for a passionate developer to join our growing team. You'll work on cutting-edge projects and collaborate with talented engineers.",
  "Join our innovative team and help build the next generation of web applications. We offer competitive benefits and a flexible work environment.",
  "We're seeking a skilled professional to drive our technical initiatives forward. This role offers excellent growth opportunities and challenging projects.",
  "Be part of our mission to revolutionize the industry. We're looking for someone who is eager to learn and contribute to our dynamic team.",
  "Help us build scalable solutions that impact millions of users. We offer a collaborative environment and opportunities for professional development.",
];

const JOB_REQUIREMENTS = [
  [
    "3+ years experience",
    "Strong problem-solving skills",
    "Team collaboration",
  ],
  [
    "Bachelor's degree in CS or related field",
    "2+ years professional experience",
    "Excellent communication skills",
  ],
  [
    "Proficiency in modern frameworks",
    "Experience with version control",
    "Agile methodology experience",
  ],
  [
    "Strong analytical thinking",
    "Attention to detail",
    "Ability to work independently",
  ],
  ["5+ years experience", "Leadership skills", "Mentoring experience"],
];

const JOB_LOCATIONS = [
  "San Francisco, CA",
  "New York, NY",
  "Austin, TX",
  "Seattle, WA",
  "Remote",
  "Boston, MA",
  "Chicago, IL",
  "Denver, CO",
  "Los Angeles, CA",
  "Portland, OR",
];

const JOB_TAGS = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "JavaScript",
  "AWS",
  "Docker",
  "Kubernetes",
  "Machine Learning",
  "Data Science",
  "UI/UX",
  "Design",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Agile",
  "Scrum",
  "DevOps",
  "Security",
  "Mobile",
  "iOS",
  "Android",
];

// Generate jobs
export const generateJobs = (): Job[] => {
  const jobs: Job[] = [];
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  const endDate = new Date();

  for (let i = 0; i < 25; i++) {
    const title = randomPick(JOB_TITLES);
    const slug = generateSlug(title);
    const createdAt = randomDate(startDate, endDate);
    const updatedAt = randomDate(createdAt, endDate);

    jobs.push({
      id: generateId(),
      title,
      slug,
      status: Math.random() < 0.8 ? "active" : "archived",
      tags: randomPickMultiple(JOB_TAGS, Math.floor(Math.random() * 5) + 2),
      order: i + 1,
      description: randomPick(JOB_DESCRIPTIONS),
      requirements: randomPick(JOB_REQUIREMENTS),
      location: randomPick(JOB_LOCATIONS),
      salary: Math.random() < 0.7 ? generateSalaryRange() : undefined,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
  }

  return jobs.sort((a, b) => a.order - b.order);
};

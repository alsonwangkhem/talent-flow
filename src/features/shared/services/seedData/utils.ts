import { faker } from "@faker-js/faker";

// Helper function to generate random IDs
export const generateId = () => crypto.randomUUID();

// Helper function to generate random dates within a range
export const randomDate = (start: Date, end: Date) => {
  return faker.date.between({ from: start, to: end });
};

// Helper function to pick random items from array
export const randomPick = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

// Helper function to pick multiple random items
export const randomPickMultiple = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to generate a slug from a title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

// Helper function to generate a random phone number
export const generatePhoneNumber = (): string => {
  return faker.phone.number();
};

// Helper function to generate a random email
export const generateEmail = (firstName: string, lastName: string): string => {
  const domains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "company.com",
    "techcorp.com",
    "startup.io",
    "dev.com",
    "engineer.net",
    "professional.org",
  ];

  const domain = randomPick(domains);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
};

// Helper function to generate a random salary range
export const generateSalaryRange = () => {
  const min = faker.number.int({ min: 50000, max: 150000 });
  const max = faker.number.int({ min: min + 10000, max: min + 100000 });

  return {
    min,
    max,
    currency: "USD" as const,
  };
};

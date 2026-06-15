/**
 * Types and interfaces for the GitHub Scorecard Generator.
 */

export interface GithubProfile {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  location: string;
  website: string;
  twitterUsername: string;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
  hasReadmeProfile: boolean;
  socialLinksCount: number;
}

export interface RepoAnalysis {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  watchers: number;
  qualityScore: number; // 0 - 100
  status: 'Optimized' | 'Active' | 'Warning' | 'Inactive';
  license: string;
  hasReadme: boolean;
  hasLicense: boolean;
  topics: string[];
  cognitiveComplexity: 'Low' | 'Medium' | 'High';
  refactorsCount: number;
  bugsCount: number;
  techDebtHours: number; // estimated hours
  aiFeedback: {
    qualityRating: string; // "Excellent", "Good", "Needs Improvement"
    strengths: string[];
    improvements: string[];
  };
}

export interface ScorecardMetrics {
  profileCompleteness: number;  // 0 - 100
  followers: number;            // 0 - 100
  repositoryQuality: number;    // 0 - 200
  contributionActivity: number;  // 0 - 250
  openSourceEngagement: number; // 0 - 150
  codeConsistency: number;      // 0 - 100
  communityImpact: number;      // 0 - 100
}

export interface Scorecard {
  overallScore: number; // 0 - 1000
  grade: 'S+' | 'S' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'Beginner';
  percentile: number; // e.g., Top 2%
  metrics: ScorecardMetrics;
  streak: number; // commit streak in days
  yearlyCommitsCount: number;
  weeklyCommits: number[]; // 7 elements (Mon-Sun)
  weeklyPrs: number[]; // 7 elements (Mon-Sun)
  radarData: {
    subject: string;
    value: number; // 0 - 100 scaled value
  }[];
  improvements: string[];
  careerInsights: {
    suitableRoles: string[];
    skillLevel: 'Expert' | 'Advanced' | 'Intermediate' | 'Beginner';
    summary: string;
  };
  analyzedAt: string;
}

export interface ScorecardReport {
  profile: GithubProfile;
  scorecard: Scorecard;
  repositories: RepoAnalysis[];
}

export interface LeaderboardEntry {
  username: string;
  name: string;
  avatarUrl: string;
  overallScore: number;
  grade: string;
  percentile: string;
  followers: number;
  publicRepos: number;
  college?: string;
  country?: string;
}

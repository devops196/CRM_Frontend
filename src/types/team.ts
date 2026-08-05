/**
 * Represents a single member of the team within the CRM workspace with credit metrics.
 */
export interface TeamMember {
  /** Unique identifier for the team member */
  id: string;
  /** Employee ID (e.g., EMP-1001) */
  employeeId: string;
  /** Full display name */
  name: string;
  /** Company email address (must end with @quickads.ai) */
  email: string;
  /** URL to profile photo — undefined/null if not available */
  photoURL?: string | null;
  /** Initials derived from name for avatar fallback */
  initials: string;
  /** Role in the team */
  role: 'Admin' | 'Customer' | 'User';
  /** Account membership status */
  status: 'Active' | 'Inactive' | 'Pending';
  accountStatus: 'Active' | 'Inactive' | 'Pending';
  /** Available credits for CRM tasks */
  creditsAvailable: number;
  /** Total credits assigned */
  totalCredits: number;
  /** Credit consumption percentage (0-100%) */
  usagePercentage: number;
  /** Credit remaining percentage (0-100%) */
  remainingPercentage: number;
  /** Color health indicator badge level */
  creditHealth: 'Healthy' | 'Warning' | 'Critical';
  /** ISO timestamp of when this member was added / created */
  createdAt?: string;

  // 11 PostgreSQL credit category fields
  generationCreditsUsed?: number;
  generationCreditsTotal?: number;

  videoCreditsUsed?: number;
  videoCreditsTotal?: number;

  voiceCreditsUsed?: number;
  voiceCreditsTotal?: number;

  voiceCloneCreditsUsed?: number;
  voiceCloneCreditsTotal?: number;

  analysisCreditsUnlimited?: boolean;

  ugcCreditsUsed?: number;
  ugcCreditsTotal?: number;

  imageCreditsUsed?: number;
  imageCreditsTotal?: number;

  imageToVideoCreditsUsed?: number;
  imageToVideoCreditsTotal?: number;

  aiVideoCreditsUsed?: number;
  aiVideoCreditsTotal?: number;

  brandsCreated?: number;
  brandsLimit?: number;

  usersAdded?: number;
  usersLimit?: number;
}

export interface TeamFilters {
  search: string;
  role: string;
  accountStatus: string;
  creditRange: string;
}

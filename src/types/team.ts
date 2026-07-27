/**
 * Represents a single member of the team within the CRM workspace.
 */
export interface TeamMember {
  /** Unique identifier for the team member */
  id: string;
  /** Full display name */
  name: string;
  /** Company email address (must end with @quickads.ai) */
  email: string;
  /** URL to profile photo (Google avatar) — undefined if not available */
  photoURL?: string;
  /** Initials derived from name for avatar fallback */
  initials: string;
  /** Role in the team */
  role: 'Admin' | 'User';
  /** Membership status */
  status: 'Active' | 'Pending';
  /** ISO timestamp of when this member was added */
  createdAt: string;
}

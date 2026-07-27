import type { TeamMember } from '../types/team';
import { resolveDisplayName, getInitials } from '../utils/formatUserName';
import type { AuthUser } from '../types/user';

const TEAM_STORAGE_KEY = 'crm_team_members';

/**
 * Loads all team members from localStorage.
 * Returns an empty array if no data is found or data is corrupted.
 */
export const loadTeamMembers = (): TeamMember[] => {
  try {
    const raw = localStorage.getItem(TEAM_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as TeamMember[];
  } catch {
    return [];
  }
};

/**
 * Persists the full team members array to localStorage.
 */
export const saveTeamMembers = (members: TeamMember[]): void => {
  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(members));
};

/**
 * Adds a new team member. Prevents duplicate email entries.
 *
 * @param members - The current team members array.
 * @param email - The email of the new member to add.
 * @returns The updated team members array (original is not mutated).
 */
export const addTeamMember = (
  members: TeamMember[],
  email: string
): TeamMember[] => {
  // Prevent duplicates
  if (members.some((m) => m.email.toLowerCase() === email.toLowerCase())) {
    return members;
  }

  const name = resolveDisplayName(undefined, email);
  const initials = getInitials(name);

  const newMember: TeamMember = {
    id: `tm_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    email,
    photoURL: undefined,
    initials,
    role: 'User',
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  const updated = [...members, newMember];
  saveTeamMembers(updated);
  return updated;
};

/**
 * Creates a team member entry from the currently authenticated user.
 * The owner is always Admin/Active and appears first in the list.
 */
export const buildOwnerMember = (authUser: AuthUser): TeamMember => ({
  id: `tm_owner_${authUser.uid}`,
  name: authUser.name,
  email: authUser.email,
  photoURL: authUser.photoURL,
  initials: authUser.initials,
  role: 'Admin',
  status: 'Active',
  createdAt: authUser.memberSince,
});

/**
 * Ensures the authenticated user is always present as the first member.
 * If they don't exist in the list, prepends them.
 */
export const ensureOwnerFirst = (
  members: TeamMember[],
  authUser: AuthUser
): TeamMember[] => {
  const ownerId = `tm_owner_${authUser.uid}`;
  const ownerEmail = authUser.email.toLowerCase();
  
  // Filter out any duplicates of the owner by ID or by Email
  const withoutOwner = members.filter(
    (m) => m.id !== ownerId && m.email.toLowerCase() !== ownerEmail
  );
  
  const owner = buildOwnerMember(authUser);
  const result = [owner, ...withoutOwner];
  saveTeamMembers(result);
  return result;
};

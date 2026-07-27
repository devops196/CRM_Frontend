import { useState, useCallback } from 'react';
import type { TeamMember } from '../types/team';
import type { AuthUser } from '../types/user';
import {
  loadTeamMembers,
  addTeamMember,
  ensureOwnerFirst,
} from '../services/team.service';
import { validateCompanyEmail } from '../utils/validateCompanyEmail';

interface UseTeamReturn {
  /** The current list of team members (owner always first) */
  members: TeamMember[];
  /** Total count of team members */
  memberCount: number;
  /**
   * Attempts to add a new member by email.
   * @returns An error string if validation fails, or `null` on success.
   */
  addMember: (email: string) => string | null;
  /** Re-initializes the team list from localStorage, ensuring owner is first */
  initTeam: (authUser: AuthUser) => void;
}

/**
 * Hook for managing team members.
 * Reads from and writes to localStorage via the team service.
 *
 * @example
 * const { members, memberCount, addMember, initTeam } = useTeam();
 */
export const useTeam = (): UseTeamReturn => {
  const [members, setMembers] = useState<TeamMember[]>([]);

  /** Called once after login to load and sync the owner as first member */
  const initTeam = useCallback((authUser: AuthUser) => {
    const stored = loadTeamMembers();
    const synced = ensureOwnerFirst(stored, authUser);
    setMembers(synced);
  }, []);

  /**
   * Validates email domain, then adds the member.
   * Returns an error message string if invalid, or `null` on success.
   */
  const addMember = useCallback(
    (email: string): string | null => {
      const trimmed = email.trim();
      if (!trimmed) return 'Please enter an email address.';
      if (!validateCompanyEmail(trimmed)) {
        return 'Use a valid login credentials.';
      }

      // Prevent duplicates
      if (members.some((m) => m.email.toLowerCase() === trimmed.toLowerCase())) {
        return 'This member has already been added.';
      }

      const updated = addTeamMember(members, trimmed);
      setMembers(updated);
      return null;
    },
    [members]
  );

  return {
    members,
    memberCount: members.length,
    addMember,
    initTeam,
  };
};

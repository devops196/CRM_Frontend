import { useState, useCallback } from 'react';
import type { TeamMember } from '../types/team';
import type { AuthUser } from '../types/user';
import {
  fetchTeamMembersFromApi,
} from '../services/team.service';

interface UseTeamReturn {
  /** The current list of team members */
  members: TeamMember[];
  /** Total count of team members */
  memberCount: number;
  /** Re-fetches team members from the backend database */
  initTeam: (authUser: AuthUser) => void;
  /** Manually set members (used after add/remove API calls) */
  setMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
}

/**
 * Hook for managing team members.
 * All data is fetched from the backend DB — no localStorage, no hardcoded data.
 */
export const useTeam = (): UseTeamReturn => {
  const [members, setMembers] = useState<TeamMember[]>([]);

  /** Loads team members directly from the backend database */
  const initTeam = useCallback((_authUser: AuthUser) => {
    fetchTeamMembersFromApi().then((apiMembers: TeamMember[]) => {
      setMembers(apiMembers);
    });
  }, []);

  return {
    members,
    memberCount: members.length,
    initTeam,
    setMembers,
  };
};

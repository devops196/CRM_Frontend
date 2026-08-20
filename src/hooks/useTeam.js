import { useState, useCallback } from 'react';
import { fetchTeamMembersFromApi } from '../services/team.service.js';

/**
 * Hook for managing team members.
 */
export const useTeam = () => {
  const [members, setMembers] = useState([]);

  const initTeam = useCallback((_authUser) => {
    fetchTeamMembersFromApi().then((apiMembers) => {
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

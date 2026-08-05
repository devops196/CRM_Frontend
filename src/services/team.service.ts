import type { TeamMember, TeamFilters } from '../types/team';
import { getInitials } from '../utils/formatUserName';
import type { AuthUser } from '../types/user';

const TEAM_STORAGE_KEY = 'crm_team_members_v2';

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [];

/**
 * Loads stored team members from localStorage.
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
 * Persists the team members array to localStorage.
 */
export const saveTeamMembers = (members: TeamMember[]): void => {
  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(members));
};

const getBaseUrl = () => (window.location.origin.includes(':5173') ? 'http://localhost:5001' : '');

/**
 * Fetches team members strictly from the backend API.
 * All data comes from the DB — no dummy data, no hardcoded fallbacks.
 */
export const fetchTeamMembersFromApi = async (
  filters?: Partial<TeamFilters>
): Promise<TeamMember[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.role) params.append('role', filters.role);
    if (filters?.accountStatus) params.append('accountStatus', filters.accountStatus);
    if (filters?.creditRange) params.append('creditRange', filters.creditRange);

    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/v1/users/team?${params.toString()}`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data.map(mapUserDtoToTeamMember);
      }
    }
  } catch (err) {
    console.error('Failed to fetch team members from database:', err);
  }

  return [];
};

/**
 * Fetches the logged-in user's explicit team members from the database.
 */
export const fetchMyTeamFromApi = async (ownerEmail: string): Promise<TeamMember[]> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/v1/users/my-team?ownerEmail=${encodeURIComponent(ownerEmail)}`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data.map(mapUserDtoToTeamMember);
      }
    }
  } catch (err) {
    console.error('Failed to fetch my team from database:', err);
  }
  return [];
};

/**
 * Adds a user to the logged-in user's team in the database.
 */
export const addMemberToMyTeamApi = async (
  ownerEmail: string,
  targetEmail: string
): Promise<{ success: boolean; message?: string; team: TeamMember[] }> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/v1/users/my-team`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ownerEmail, targetEmail }),
    });

    const json = await res.json();
    if (res.ok && json.success) {
      return {
        success: true,
        team: Array.isArray(json.data) ? json.data.map(mapUserDtoToTeamMember) : [],
      };
    }
    return {
      success: false,
      message: json.message || 'Failed to add team member.',
      team: [],
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Network error adding team member.',
      team: [],
    };
  }
};

/**
 * Removes a member from the logged-in user's team in the database.
 */
export const removeMemberFromMyTeamApi = async (
  ownerEmail: string,
  targetEmail: string
): Promise<{ success: boolean; message?: string; team: TeamMember[] }> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/v1/users/my-team`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ownerEmail, targetEmail }),
    });

    const json = await res.json();
    if (res.ok && json.success) {
      return {
        success: true,
        team: Array.isArray(json.data) ? json.data.map(mapUserDtoToTeamMember) : [],
      };
    }
    return {
      success: false,
      message: json.message || 'Failed to remove team member.',
      team: [],
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Network error removing team member.',
      team: [],
    };
  }
};

/** Helper to map user object from DB DTO */
function mapUserDtoToTeamMember(u: any): TeamMember {
  const total = u.totalCredits ?? 0;
  const available = u.creditsAvailable ?? 0;
  const used = Math.max(0, total - available);

  return {
    id: u.id,
    employeeId: u.employeeId,
    name: u.name,
    email: u.email,
    photoURL: u.picture && u.picture.trim() !== '' ? u.picture : undefined,
    initials: getInitials(u.name),
    role: u.role === 'ADMIN' ? 'Admin' : 'Customer',
    status: u.accountStatus === 'ACTIVE' ? 'Active' : 'Inactive',
    accountStatus: u.accountStatus === 'ACTIVE' ? 'Active' : 'Inactive',
    creditsAvailable: available,
    totalCredits: total,
    usagePercentage: u.usagePercentage ?? 0,
    remainingPercentage: u.remainingPercentage ?? 0,
    creditHealth: u.creditHealth || 'Healthy',
    createdAt: u.subscriptionStartDate,

    // Map 11 PostgreSQL credit fields (supporting both camelCase & lowercase API keys)
    generationCreditsUsed: u.generationCreditsUsed ?? u.generationcreditsused ?? used,
    generationCreditsTotal: u.generationCreditsTotal ?? u.generationcreditstotal ?? total,

    videoCreditsUsed: u.videoCreditsUsed ?? u.videocreditsused ?? 0,
    videoCreditsTotal: u.videoCreditsTotal ?? u.videocreditstotal ?? 0,

    voiceCreditsUsed: u.voiceCreditsUsed ?? u.voicecreditsused ?? 0,
    voiceCreditsTotal: u.voiceCreditsTotal ?? u.voicecreditstotal ?? 0,

    voiceCloneCreditsUsed: u.voiceCloneCreditsUsed ?? u.voiceclonecreditsused ?? 0,
    voiceCloneCreditsTotal: u.voiceCloneCreditsTotal ?? u.voiceclonecreditstotal ?? 0,

    analysisCreditsUnlimited: u.analysisCreditsUnlimited ?? u.analysiscreditsunlimited ?? true,

    ugcCreditsUsed: u.ugcCreditsUsed ?? u.ugccreditsused ?? 0,
    ugcCreditsTotal: u.ugcCreditsTotal ?? u.ugccreditstotal ?? 0,

    imageCreditsUsed: u.imageCreditsUsed ?? u.imagecreditsused ?? 0,
    imageCreditsTotal: u.imageCreditsTotal ?? u.imagecreditstotal ?? 0,

    imageToVideoCreditsUsed: u.imageToVideoCreditsUsed ?? u.imagetovideocreditsused ?? 0,
    imageToVideoCreditsTotal: u.imageToVideoCreditsTotal ?? u.imagetovideocreditstotal ?? 0,

    aiVideoCreditsUsed: u.aiVideoCreditsUsed ?? u.aivideocreditsused ?? 0,
    aiVideoCreditsTotal: u.aiVideoCreditsTotal ?? u.aivideocreditstotal ?? 0,

    brandsCreated: u.brandsCreated ?? u.brandscreated ?? 0,
    brandsLimit: u.brandsLimit ?? u.brandslimit ?? 0,

    usersAdded: u.usersAdded ?? u.usersadded ?? 0,
    usersLimit: u.usersLimit ?? u.userslimit ?? 0,
  };
}

/**
 * Builds a TeamMember shape from the logged-in AuthUser.
 */
export const buildOwnerMember = (authUser: AuthUser): TeamMember => {
  const creditsAvailable = authUser.creditsAvailable ?? 0;
  const totalCredits = authUser.totalCredits ?? 0;
  const used = Math.max(0, totalCredits - creditsAvailable);
  const usagePercentage = totalCredits > 0 ? Math.round((used / totalCredits) * 100) : 0;
  const remainingPercentage = totalCredits > 0 ? Math.round((creditsAvailable / totalCredits) * 100) : 0;
  let creditHealth: 'Healthy' | 'Warning' | 'Critical' = 'Healthy';
  if (remainingPercentage < 30) creditHealth = 'Critical';
  else if (remainingPercentage <= 70) creditHealth = 'Warning';

  return {
    id: `tm_owner_${authUser.uid}`,
    employeeId: authUser.uid,
    name: authUser.name,
    email: authUser.email,
    photoURL: authUser.photoURL,
    initials: authUser.initials,
    role:
      authUser.role === 'Admin' ||
      (authUser.role as string) === 'admin' ||
      (authUser.role as string) === 'super_admin'
        ? 'Admin'
        : 'Customer',
    status: authUser.status || 'Active',
    accountStatus: authUser.status || 'Active',
    creditsAvailable,
    totalCredits,
    usagePercentage,
    remainingPercentage,
    creditHealth,
    createdAt: authUser.memberSince,

    generationCreditsUsed: used,
    generationCreditsTotal: totalCredits,
  };
};

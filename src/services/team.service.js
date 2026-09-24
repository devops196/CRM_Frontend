import { getInitials } from '../utils/formatUserName.js';

const TEAM_STORAGE_KEY = 'crm_team_members_v2';

export const INITIAL_TEAM_MEMBERS = [];

/**
 * Loads stored team members from localStorage.
 */
export const loadTeamMembers = () => {
  try {
    const raw = localStorage.getItem(TEAM_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

/**
 * Persists the team members array to localStorage.
 */
export const saveTeamMembers = (members) => {
  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(members));
};

const getBaseUrl = () => {
  if (typeof window === 'undefined') return '';
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocal ? 'http://localhost:8000' : '';
};

/**
 * Fetches team members strictly from the backend API.
 */
export const fetchTeamMembersFromApi = async (filters) => {
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
 * Fetches a single user by identifier (ID, employee ID, or email) from the backend API.
 */
export const fetchUserByIdentifierFromApi = async (identifier) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/v1/users/lookup/${encodeURIComponent(identifier)}`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return mapUserDtoToTeamMember(json.data);
      }
    }
  } catch (err) {
    console.error(`Failed to fetch user by identifier "${identifier}":`, err);
  }
  return null;
};

/**
 * Fetches the logged-in user's explicit team members from the database.
 */
export const fetchMyTeamFromApi = async (ownerEmail) => {
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
export const addMemberToMyTeamApi = async (ownerEmail, targetEmail) => {
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
  } catch (err) {
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
export const removeMemberFromMyTeamApi = async (ownerEmail, targetEmail) => {
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
  } catch (err) {
    return {
      success: false,
      message: err.message || 'Network error removing team member.',
      team: [],
    };
  }
};

/**
 * Normal user: allocate credits from owner's balance to a teammate.
 * POST /api/v1/users/team/allocate-credits
 */
export const allocateCreditsApi = async (callerEmail, targetIdentifier, allocations) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/v1/users/team/allocate-credits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ callerEmail, targetIdentifier, allocations }),
    });
    const json = await res.json();
    return {
      success: res.ok && json.success,
      message: json.message || json.detail || '',
      data: json.data ? mapUserDtoToTeamMember(json.data) : null,
    };
  } catch (err) {
    return { success: false, message: err.message || 'Network error.' };
  }
};

/**
 * Admin: add credits directly to any user without touching admin balance.
 * POST /api/v1/users/team/admin/add-credits
 */
export const adminAddCreditsApi = async (callerEmail, targetIdentifier, allocations) => {
  const adminEmail = callerEmail || 'crm_admin@quickads.ai';
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/v1/users/team/admin/add-credits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ callerEmail: adminEmail, targetIdentifier, allocations }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      return {
        success: json.success !== false,
        message: json.message || json.detail || 'Credits successfully added.',
        data: json.data ? mapUserDtoToTeamMember(json.data) : null,
      };
    }
    // Non-2xx: return the server error instead of swallowing it
    return {
      success: false,
      message: json.detail || json.message || `Server error (${res.status})`,
      data: null,
    };
  } catch (err) {
    console.warn('Backend API unreachable for adminAddCreditsApi, applying update locally:', err);
  }
  // Only reach here on network failure (fetch threw)
  return {
    success: true,
    message: 'Credits successfully added (local mode).',
    data: {
      id: targetIdentifier,
      employeeId: targetIdentifier,
      name: 'User',
      ...allocations,
    },
  };
};

/**
 * Admin: update or set credit balances for any user directly in the database.
 * POST /api/v1/users/team/admin/update-credits
 */
export const adminUpdateCreditsApi = async (callerEmail, targetIdentifier, creditUpdates, mode = 'add', resetUsed = false) => {
  const adminEmail = callerEmail || 'crm_admin@quickads.ai';
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/v1/users/team/admin/update-credits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ callerEmail: adminEmail, targetIdentifier, creditUpdates, mode, resetUsed }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      return {
        success: json.success !== false,
        message: json.message || json.detail || 'Credit balances successfully updated.',
        data: json.data ? mapUserDtoToTeamMember(json.data) : null,
      };
    }
    // Non-2xx: return the server error instead of swallowing it
    return {
      success: false,
      message: json.detail || json.message || `Server error (${res.status})`,
      data: null,
    };
  } catch (err) {
    console.warn('Backend API unreachable for adminUpdateCreditsApi, applying update locally:', err);
  }
  // Only reach here on network failure (fetch threw)
  return {
    success: true,
    message: 'Credit balances successfully updated (local mode).',
    data: {
      id: targetIdentifier,
      employeeId: targetIdentifier,
      name: 'User',
      ...creditUpdates,
    },
  };
};

export const LOCAL_PLAN_LIMITS = {
  'discover': { generationCreditsTotal: 50, videoCreditsTotal: 10, voiceCreditsTotal: 20, voiceCloneCreditsTotal: 5, ugcCreditsTotal: 10, imageCreditsTotal: 50, imageToVideoCreditsTotal: 10, analysisCreditsUnlimited: false },
  'all access 99': { generationCreditsTotal: 500, videoCreditsTotal: 100, voiceCreditsTotal: 200, voiceCloneCreditsTotal: 50, ugcCreditsTotal: 100, imageCreditsTotal: 500, imageToVideoCreditsTotal: 100, analysisCreditsUnlimited: false },
  'all access 99 yearly': { generationCreditsTotal: 6000, videoCreditsTotal: 1200, voiceCreditsTotal: 2400, voiceCloneCreditsTotal: 600, ugcCreditsTotal: 1200, imageCreditsTotal: 6000, imageToVideoCreditsTotal: 1200, analysisCreditsUnlimited: true },
  'quickads_tier4': { generationCreditsTotal: 1000, videoCreditsTotal: 250, voiceCreditsTotal: 500, voiceCloneCreditsTotal: 100, ugcCreditsTotal: 250, imageCreditsTotal: 1000, imageToVideoCreditsTotal: 250, analysisCreditsUnlimited: false },
  'quickads_tier6': { generationCreditsTotal: 2500, videoCreditsTotal: 600, voiceCreditsTotal: 1200, voiceCloneCreditsTotal: 250, ugcCreditsTotal: 600, imageCreditsTotal: 2500, imageToVideoCreditsTotal: 600, analysisCreditsUnlimited: true },
  'enterprise': { generationCreditsTotal: 99999, videoCreditsTotal: 99999, voiceCreditsTotal: 99999, voiceCloneCreditsTotal: 99999, ugcCreditsTotal: 99999, imageCreditsTotal: 99999, imageToVideoCreditsTotal: 99999, analysisCreditsUnlimited: true },
};

/**
 * Admin: Update user subscription plan and reset/overwrite credit allocations to hardcoded tier limits.
 * POST /api/v1/users/update-subscription
 */
export const updateUserSubscriptionPlanApi = async (email, newPlanName) => {
  const normPlan = (newPlanName || 'discover').toLowerCase().trim();
  const fallbackLimits = LOCAL_PLAN_LIMITS[normPlan] || LOCAL_PLAN_LIMITS[normPlan.replace(/\s+/g, '_')] || LOCAL_PLAN_LIMITS[normPlan.replace(/_/g, ' ')] || LOCAL_PLAN_LIMITS['discover'];

  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/v1/users/update-subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, new_plan_name: newPlanName }),
    });

    if (res.ok) {
      const json = await res.json();
      return {
        success: true,
        message: json.message || 'Subscription plan updated successfully!',
        data: json.data ? mapUserDtoToTeamMember(json.data) : null,
        updated_credits: json.updated_credits || fallbackLimits,
      };
    } else {
      const json = await res.json().catch(() => ({}));
      return {
        success: false,
        message: json.detail || json.message || `Server error (${res.status})`,
      };
    }
  } catch (err) {
    console.warn('Backend API unreachable, applying subscription update locally:', err);
    return {
      success: true,
      message: `Plan updated to ${normPlan.toUpperCase()} (local mode).`,
      data: {
        subscriptionPlan: normPlan,
        ...fallbackLimits,
      },
      updated_credits: fallbackLimits,
    };
  }
};

/** Helper to map user object from DB DTO */
function mapUserDtoToTeamMember(u) {
  const total = u.totalCredits ?? u.generationcreditstotal ?? 0;
  const available = u.creditsAvailable ?? (total - (u.generationcreditsused ?? 0));
  const used = Math.max(0, total - available);

  return {
    id: u.id || u.uuid,
    employeeId: u.employeeId || `EMP-${String(u.uuid || u.id || '').slice(0, 8)}`,
    name: u.name,
    email: u.email,
    photoURL: u.picture && u.picture.trim() !== '' ? u.picture : undefined,
    initials: getInitials(u.name),
    role: (u.role || '').toUpperCase() === 'ADMIN' ? 'Admin' : 'Customer',
    status: (u.accountStatus || '').toUpperCase() === 'ACTIVE' ? 'Active' : 'Inactive',
    accountStatus: (u.accountStatus || '').toUpperCase() === 'ACTIVE' ? 'Active' : 'Inactive',
    subscriptionPlan: u.subscriptionPlan || u.subscription_plan || 'discover',
    creditsAvailable: available,
    totalCredits: total,
    usagePercentage: u.usagePercentage ?? 0,
    remainingPercentage: u.remainingPercentage ?? 0,
    creditHealth: u.creditHealth || 'Healthy',
    createdAt: u.subscriptionStartDate,

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
export const buildOwnerMember = (authUser) => {
  const creditsAvailable = authUser.creditsAvailable ?? 0;
  const totalCredits = authUser.totalCredits ?? 0;
  const used = Math.max(0, totalCredits - creditsAvailable);
  const usagePercentage = totalCredits > 0 ? Math.round((used / totalCredits) * 100) : 0;
  const remainingPercentage = totalCredits > 0 ? Math.round((creditsAvailable / totalCredits) * 100) : 0;
  let creditHealth = 'Healthy';
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
      authUser.role === 'admin' ||
      authUser.role === 'super_admin'
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

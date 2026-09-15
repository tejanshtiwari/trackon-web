const API_BASE = 'https://trackon-web-backend.onrender.com';

export async function apiRequest(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('TRACKON_token');
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP error ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error(`API Error on ${method} ${endpoint}:`, error);
    throw error;
  }
}

// Specific API helper services
export const authApi = {
  requestOtp: (employeeId, email) => apiRequest('/auth/request-otp', 'POST', { employeeId, email }),
  verifyOtp: (employeeId, otp) => apiRequest('/auth/verify-otp', 'POST', { employeeId, otp }),
  getMe: () => apiRequest('/auth/me'),
  getDemoUsers: () => apiRequest('/auth/demo-users'),
};

export const incidentApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/incidents?${query}`);
  },
  getById: (id) => apiRequest(`/incidents/${id}`),
  create: (data) => apiRequest('/incidents', 'POST', data),
  updateStatus: (id, status, notes, assignedTeamId) =>
    apiRequest(`/incidents/${id}`, 'PATCH', { status, notes, assignedTeamId }),
  getNearbyPersonnel: (lat, lng, radiusKm = 25) =>
    apiRequest(`/incidents/nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`),
  getRailwayTracks: () => apiRequest('/railway-tracks'),
};

export const aiApi = {
  scanDefect: (data) => apiRequest('/ai/scan-defect', 'POST', data),
  getRiskZones: () => apiRequest('/ai/risk-zones'),
  generateReport: () => apiRequest('/ai/maintenance-report'),
};

export const maintenanceApi = {
  getTeams: () => apiRequest('/maintenance/teams'),
  assignTeam: (incidentId, teamId, instructions) =>
    apiRequest('/maintenance/assign', 'POST', { incidentId, teamId, instructions }),
  completeTask: (incidentId, repairEvidencePhoto, repairNotes, crewLeaderSignOff) =>
    apiRequest('/maintenance/complete', 'POST', {
      incidentId,
      repairEvidencePhoto,
      repairNotes,
      crewLeaderSignOff,
    }),
};

export const analyticsApi = {
  getOverview: () => apiRequest('/analytics/overview'),
};

export const auditApi = {
  getLogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/audit-logs?${query}`);
  },
  verifyIntegrity: () => apiRequest('/audit-logs/verify-integrity'),
  getAlertLogs: () => apiRequest('/alerts/history'),
};

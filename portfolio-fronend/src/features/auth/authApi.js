import apiClient, { setCsrfToken } from '../../lib/apiClient';

export const listUsers = async () => (await apiClient.get('/users')).data.users;
export const createUser = async (payload) => (await apiClient.post('/users', payload)).data.user;
export const updateUser = async ({ id, ...payload }) => (await apiClient.patch(`/users/${id}`, payload)).data.user;
export const resetUserPassword = async ({ id, password }) => (await apiClient.post(`/users/${id}/password`, { password })).data;
export const revokeUserSessions = async (id) => (await apiClient.post(`/users/${id}/revoke-sessions`)).data;
export const revokeOtherSessions = async () => (await apiClient.post('/auth/sessions/revoke-others')).data;
export const changePassword = async (payload) => {
  const { data } = await apiClient.post('/auth/password', payload);
  setCsrfToken(data.csrfToken);
  return data.user;
};

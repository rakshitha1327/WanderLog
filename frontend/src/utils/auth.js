export const getUserEmail = (user) => {
  return user?.email || user?.userEmail || user?.username;
};

export const isAuthenticated = (user) => {
  const userEmail = getUserEmail(user);
  return !!userEmail;
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

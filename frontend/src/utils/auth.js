// src/utils/auth.js

export const saveUser = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getUserRole = () => {
  const user = getUser();
  return user?.role || null;
};

export const getUserName = () => {
  const user = getUser();
  return user?.name || null;
};

export const logout = () => {
  localStorage.removeItem("user");
};

import React, { useState, useCallback, useEffect } from "react";
export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(null);

  const login = useCallback((uid, token) => {
    //useCallback let this func only run once i.e never re-created & never be infinite loops
    setToken(token);
    setUserId(uid);
    localStorage.setItem(
      "userData",
      JSON.stringify({ userId: uid, token: token })
    ); //obj to json
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    //useEffect runs only after component render is completed
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      login(storedData.userId, storedData.token);
    }
  }, [login]);

  return { login, logout, token, userId };
};

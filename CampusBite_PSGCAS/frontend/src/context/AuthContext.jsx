import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";
import { DEMO_USERS } from "../api/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("campusbite_user");
      return stored ? JSON.parse(stored) : DEMO_USERS.student;
    } catch {
      return DEMO_USERS.student;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [targetInitialRole, setTargetInitialRole] = useState("student");

  useEffect(() => {
    if (user) {
      localStorage.setItem("campusbite_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("campusbite_user");
    }
  }, [user]);

  const loginWithCredentials = async (username, password, roleHint = "student") => {
    try {
      const res = await API.post("auth/login/", { username, password, role: roleHint });
      const authData = {
        ...res.data.user,
        token: res.data.token,
      };
      setUser(authData);
      setIsLoginModalOpen(false);
      return authData;
    } catch (err) {
      // Offline fallback: match demo usernames
      const cleanUser = username.toLowerCase().trim();
      let matched = null;
      if (cleanUser.includes("teacher") || cleanUser.includes("priya")) {
        matched = DEMO_USERS.teacher;
      } else if (cleanUser.includes("admin")) {
        matched = DEMO_USERS.admin;
      } else if (cleanUser.includes("kitchen") || cleanUser.includes("chef")) {
        matched = DEMO_USERS.kitchen;
      } else {
        matched = {
          ...DEMO_USERS.student,
          fullName: username,
          username: username,
          rollNumber: username.toUpperCase().startsWith("2") ? username.toUpperCase() : "23BCS042",
        };
      }
      setUser(matched);
      setIsLoginModalOpen(false);
      return matched;
    }
  };

  const quickSwitchRole = async (targetRole) => {
    const fallbackUser = DEMO_USERS[targetRole] || DEMO_USERS.student;
    try {
      const res = await API.post("auth/login/", { role: targetRole }, { timeout: 2000 });
      const authData = {
        ...res.data.user,
        token: res.data.token,
      };
      setUser(authData);
      setIsLoginModalOpen(false);
      return authData;
    } catch (err) {
      setUser(fallbackUser);
      setIsLoginModalOpen(false);
      return fallbackUser;
    }
  };

  const registerUser = async (data) => {
    try {
      const res = await API.post("auth/register/", data, { timeout: 2000 });
      const authData = {
        ...res.data.user,
        token: res.data.token,
      };
      setUser(authData);
      setIsLoginModalOpen(false);
      return authData;
    } catch (err) {
      // Local register fallback
      const newUser = {
        id: Date.now(),
        username: data.username,
        fullName: data.full_name || data.username,
        role: data.role || "student",
        rollNumber: data.roll_number || (data.role === "teacher" ? "FAC-9001" : "23BCS101"),
        email: data.email || `${data.username}@psgcas.ac.in`,
        department: data.department || (data.role === "teacher" ? "Academic Faculty" : "UG Degree"),
        token: `cb-token-${Date.now()}-${data.role || "student"}`,
      };
      setUser(newUser);
      setIsLoginModalOpen(false);
      return newUser;
    }
  };

  const logout = () => {
    setUser(DEMO_USERS.student);
  };

  const openLoginForRole = (role) => {
    setTargetInitialRole(role || "student");
    setIsLoginModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "student",
        isAdmin: user?.role === "admin",
        isKitchen: user?.role === "kitchen",
        isStudent: user?.role === "student",
        isTeacher: user?.role === "teacher",
        isLoginModalOpen,
        targetInitialRole,
        openLoginModal: () => openLoginForRole(user?.role || "student"),
        openLoginForRole,
        closeLoginModal: () => setIsLoginModalOpen(false),
        loginWithCredentials,
        quickSwitchRole,
        registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

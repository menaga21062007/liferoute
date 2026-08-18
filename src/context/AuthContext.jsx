import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const MOCK_USERS = [
  {
    id: "u-1",
    email: "crew@liferoute.org",
    role: "ambulance",
    name: "Marcus Vance (Paramedic Crew)",
    tagline: "Rapid Response Unit AMB-101",
    hospitalId: null
  },
  {
    id: "u-2",
    email: "er@metrohospital.org",
    role: "hospital",
    name: "Dr. Aris Thorne (ER Chief)",
    tagline: "Metropolitan Central Hospital",
    hospitalId: "hosp-1"
  },
  {
    id: "u-3",
    email: "traffic@citycontrol.gov",
    role: "traffic",
    name: "Officer Alex Mercer",
    tagline: "Metro Green Corridor Command",
    hospitalId: null
  },
  {
    id: "u-4",
    email: "admin@liferoute.org",
    role: "command",
    name: "Command Director Vance",
    tagline: "Central Response Administrator",
    hospitalId: null
  }
];

export const AuthProvider = ({ children }) => {
  // Default to logged-in user for quick demo presentation capability
  const [user, setUser] = useState(MOCK_USERS[3]); // Command admin by default

  const login = (email, password) => {
    const foundUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      return { success: true, user: foundUser };
    }
    // Fallback login for any input
    const fallback = {
      id: `u-${Date.now()}`,
      email,
      role: 'ambulance',
      name: email.split('@')[0] || 'Demo User',
      tagline: 'Emergency Dispatch'
    };
    setUser(fallback);
    return { success: true, user: fallback };
  };

  const quickRoleLogin = (role) => {
    const matched = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
    setUser(matched);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, quickRoleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserPreferences } from '../types';
import { SEED_USERS } from '../data/seed';
import { generateId } from '../utils';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  preferences: UserPreferences;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
  updatePreferences: (updatedPrefs: Partial<UserPreferences>) => void;
}

const STORAGE_KEY_USER = 'warroom_current_user';
const STORAGE_KEY_USERS_LIST = 'warroom_users_list';
const STORAGE_KEY_PREFS = 'warroom_preferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  emailNotifications: true,
  roomActivityNotifications: true,
  theme: 'light',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }
    // Default to the first seed user for immediate smooth demo experience
    return SEED_USERS[0];
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored preferences', e);
      }
    }
    return DEFAULT_PREFERENCES;
  });

  // Apply theme class to document element
  useEffect(() => {
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.theme]);

  // Ensure user directory in localStorage
  useEffect(() => {
    const existing = localStorage.getItem(STORAGE_KEY_USERS_LIST);
    if (!existing) {
      localStorage.setItem(STORAGE_KEY_USERS_LIST, JSON.stringify(SEED_USERS));
    }
  }, []);

  const login = async (email: string, _password?: string): Promise<boolean> => {
    // Simulate brief network delay for polish
    await new Promise((r) => setTimeout(r, 450));

    let usersList: User[] = SEED_USERS;
    const stored = localStorage.getItem(STORAGE_KEY_USERS_LIST);
    if (stored) {
      try {
        usersList = JSON.parse(stored);
      } catch {}
    }

    const found = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(found));
      return true;
    }

    // If email is not in seed, create user on the fly for demo flexibility
    const newUser: User = {
      id: generateId(),
      name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Team Member',
      email: email,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      bio: 'Collaborator in WarRoom workspace.',
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...usersList, newUser];
    localStorage.setItem(STORAGE_KEY_USERS_LIST, JSON.stringify(updatedUsers));
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    setUser(newUser);
    return true;
  };

  const register = async (name: string, email: string, _password?: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 500));

    let usersList: User[] = SEED_USERS;
    const stored = localStorage.getItem(STORAGE_KEY_USERS_LIST);
    if (stored) {
      try {
        usersList = JSON.parse(stored);
      } catch {}
    }

    const newUser: User = {
      id: generateId(),
      name,
      email,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      bio: 'Ready to coordinate, share resources, and hit room milestones.',
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...usersList, newUser];
    localStorage.setItem(STORAGE_KEY_USERS_LIST, JSON.stringify(updatedUsers));
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));

    // Update in users list
    const stored = localStorage.getItem(STORAGE_KEY_USERS_LIST);
    if (stored) {
      try {
        const list: User[] = JSON.parse(stored);
        const idx = list.findIndex((u) => u.id === user.id);
        if (idx >= 0) {
          list[idx] = updated;
          localStorage.setItem(STORAGE_KEY_USERS_LIST, JSON.stringify(list));
        }
      } catch {}
    }
  };

  const updatePreferences = (updatedPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...updatedPrefs };
    setPreferences(updated);
    localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        preferences,
        login,
        register,
        logout,
        updateProfile,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

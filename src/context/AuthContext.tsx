import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '../types/social';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  currentUser: UserProfile;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (email?: string, password?: string) => Promise<void>;
  logout: () => void;
  switchUser: (profile: UserProfile) => void;
}

export const DEMO_PROFILES: UserProfile[] = [
  {
    id: 'user-admin',
    name: 'Alex Rivera (Admin)',
    handle: '@alex_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Platform Administrator & Lead Architect',
    isAdmin: true,
    verified: true,
    verifiedLabel: 'Admin',
    status: 'online',
    bio: 'Platform maintainer for Sengon social core and distributed real-time relays.'
  },
  {
    id: 'user-marcus',
    name: 'Marcus Chen',
    handle: '@marcus_dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Principal Architect @ Veloce Labs',
    isAdmin: false,
    verified: true,
    verifiedLabel: 'Staff Author',
    status: 'online',
    bio: 'Exploring high-frequency collaborative canvases, reactive CRDT networks, and edge WebAssembly engines.'
  },
  {
    id: 'user-elena',
    name: 'Elena Rostova',
    handle: '@elena_systems',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'Distributed Consensus Engineer',
    isAdmin: false,
    verified: true,
    verifiedLabel: 'Author Network',
    status: 'online',
    bio: 'P2P network topologies, Raft consensus implementations, and low-latency state machines.'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sengon_active_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEMO_PROFILES[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('sengon_active_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const login = async (email?: string, password?: string) => {
    if (email && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          setCurrentUser({
            id: data.user.id,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
            handle: '@' + (data.user.email?.split('@')[0] || 'user'),
            avatar: data.user.user_metadata?.avatar_url || DEMO_PROFILES[0].avatar,
            role: 'Verified Contributor',
            verified: true,
            status: 'online'
          });
        }
      } catch (err) {
        console.warn('Supabase auth fallback to demo profile:', err);
      }
    }
    setIsAuthenticated(true);
    closeLoginModal();
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser({
      id: 'guest',
      name: 'Guest Visitor',
      handle: '@guest',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      role: 'Viewer',
      status: 'offline'
    });
  };

  const switchUser = (profile: UserProfile) => {
    setCurrentUser(profile);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        login,
        logout,
        switchUser
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

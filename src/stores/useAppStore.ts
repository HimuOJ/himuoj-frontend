import { create } from 'zustand';

export type TabType = 'explorer' | 'editor' | 'testcase' | 'result' | 'settings';

export type SubmissionStatus = 'idle' | 'pending' | 'accepted' | 'wrong-answer' | 'error';

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

interface AppState {
  // Navigation
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  // Status Bar Info
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;

  compileStatus: 'idle' | 'compiling' | 'success' | 'error';
  setCompileStatus: (status: 'idle' | 'compiling' | 'success' | 'error') => void;

  lastRunTime: string | null;
  setLastRunTime: (time: string | null) => void;

  submissionStatus: SubmissionStatus;
  setSubmissionStatus: (status: SubmissionStatus) => void;

  connectionStatus: ConnectionStatus;
  setConnectionStatus: (status: ConnectionStatus) => void;

  userInfo: { name: string; avatar?: string } | null;
  setUserInfo: (user: { name: string; avatar?: string } | null) => void;

  // Theme
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Navigation
  activeTab: 'explorer',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Status Bar Info
  currentLanguage: 'C++',
  setCurrentLanguage: (lang) => set({ currentLanguage: lang }),

  compileStatus: 'idle',
  setCompileStatus: (status) => set({ compileStatus: status }),

  lastRunTime: null,
  setLastRunTime: (time) => set({ lastRunTime: time }),

  submissionStatus: 'idle',
  setSubmissionStatus: (status) => set({ submissionStatus: status }),

  connectionStatus: 'connected',
  setConnectionStatus: (status) => set({ connectionStatus: status }),

  userInfo: { name: 'Guest' },
  setUserInfo: (user) => set({ userInfo: user }),

  // Theme
  isDarkMode: false,
  setIsDarkMode: (dark) => set({ isDarkMode: dark }),
}));

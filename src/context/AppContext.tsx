import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ApplicationTrack,
  JourneyStage,
  QuestMission,
  Scholarship,
  StudentProfile,
  UserDocument,
} from '../types/scholarship';
import {
  DEFAULT_STUDENT_PROFILE,
  INITIAL_QUEST_MISSIONS,
  INITIAL_SCHOLARSHIPS,
  INITIAL_USER_DOCUMENTS,
} from '../data/scholarships';
import { evaluateScholarshipMatch } from '../utils/matching';

export type AppTab =
  | 'landing'
  | 'dashboard'
  | 'discover'
  | 'radar'
  | 'analyzer'
  | 'stacking'
  | 'journey'
  | 'vault'
  | 'deadlines'
  | 'whatif'
  | 'assistant'
  | 'profile';

interface AppContextType {
  tab: AppTab;
  setTab: (tab: AppTab) => void;
  profile: StudentProfile;
  updateProfile: (profile: StudentProfile) => void;
  scholarships: Scholarship[];
  documents: UserDocument[];
  addDocument: (doc: Omit<UserDocument, 'id' | 'uploadDate'>) => void;
  removeDocument: (id: string) => void;
  savedScholarshipIds: string[];
  toggleSaveScholarship: (id: string) => void;
  applicationTracks: Record<string, ApplicationTrack>;
  updateApplicationStage: (scholarshipId: string, stage: JourneyStage) => void;
  updateApplicationChecklist: (scholarshipId: string, checklistId: string, completed: boolean) => void;
  updateApplicationNotes: (scholarshipId: string, notes: string) => void;
  selectedScholarshipId: string | null;
  setSelectedScholarshipId: (id: string | null) => void;
  gapAnalyzerScholarshipId: string | null;
  setGapAnalyzerScholarshipId: (id: string | null) => void;
  questMissions: QuestMission[];
  completeQuestMission: (id: string) => void;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;
  showAssistantDrawer: boolean;
  setShowAssistantDrawer: (show: boolean) => void;
  showQuestModal: boolean;
  setShowQuestModal: (show: boolean) => void;
  resetDemoData: () => void;
  totalQuestPoints: number;
  eligibleScholarshipsCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'grantly_profile_v1',
  DOCUMENTS: 'grantly_documents_v1',
  SAVED: 'grantly_saved_v1',
  TRACKS: 'grantly_tracks_v1',
  QUESTS: 'grantly_quests_v1',
  HAS_VISITED: 'grantly_visited_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if URL has tab param or autostart
  const [tab, setTabState] = useState<AppTab>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1' || params.get('tab') === 'dashboard') {
      return 'dashboard';
    }
    const tabParam = params.get('tab') as AppTab;
    if (tabParam && ['landing', 'dashboard', 'discover', 'radar', 'analyzer', 'stacking', 'journey', 'vault', 'deadlines', 'whatif', 'assistant', 'profile'].includes(tabParam)) {
      return tabParam;
    }
    return 'landing';
  });

  const setTab = (newTab: AppTab) => {
    setTabState(newTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Profile State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : DEFAULT_STUDENT_PROFILE;
    } catch {
      return DEFAULT_STUDENT_PROFILE;
    }
  });

  // Scholarships data (immutably maintained with initial set)
  const [scholarships] = useState<Scholarship[]>(INITIAL_SCHOLARSHIPS);

  // Documents
  const [documents, setDocuments] = useState<UserDocument[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      return saved ? JSON.parse(saved) : INITIAL_USER_DOCUMENTS;
    } catch {
      return INITIAL_USER_DOCUMENTS;
    }
  });

  // Saved Scholarship IDs
  const [savedScholarshipIds, setSavedScholarshipIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED);
      return saved ? JSON.parse(saved) : DEFAULT_STUDENT_PROFILE.savedScholarshipIds;
    } catch {
      return DEFAULT_STUDENT_PROFILE.savedScholarshipIds;
    }
  });

  // Application Tracks
  const [applicationTracks, setApplicationTracks] = useState<Record<string, ApplicationTrack>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRACKS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default initial tracked applications
    return {
      'sch-reliance-ug': {
        scholarshipId: 'sch-reliance-ug',
        stage: 'PREPARE',
        appliedDate: '2026-10-25',
        notes: 'Aptitude test scheduled. Uploaded bonafide certificate.',
        checklist: [
          { id: 'c1', label: 'College Bonafide attested', completed: true },
          { id: 'c2', label: 'Class 12th marksheet verified', completed: true },
          { id: 'c3', label: 'Online Aptitude prep completed', completed: false },
        ],
      },
      'sch-central-sector': {
        scholarshipId: 'sch-central-sector',
        stage: 'APPLY',
        appliedDate: '2026-10-30',
        notes: 'Submitted on NSP; pending college nodal verification.',
        checklist: [
          { id: 'c1', label: 'NSP Registration generated', completed: true },
          { id: 'c2', label: 'Aadhaar demographic authentication', completed: true },
          { id: 'c3', label: 'College nodal physical signoff', completed: false },
        ],
      },
    };
  });

  // Quest Missions
  const [questMissions, setQuestMissions] = useState<QuestMission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUESTS);
      return saved ? JSON.parse(saved) : INITIAL_QUEST_MISSIONS;
    } catch {
      return INITIAL_QUEST_MISSIONS;
    }
  });

  // UI Modals / Drawers
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string | null>(null);
  const [gapAnalyzerScholarshipId, setGapAnalyzerScholarshipId] = useState<string | null>(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [showAssistantDrawer, setShowAssistantDrawer] = useState<boolean>(false);
  const [showQuestModal, setShowQuestModal] = useState<boolean>(false);

  // Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
    } catch {
      // ignore
    }
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedScholarshipIds));
    } catch {
      // ignore
    }
  }, [savedScholarshipIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRACKS, JSON.stringify(applicationTracks));
    } catch {
      // ignore
    }
  }, [applicationTracks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(questMissions));
    } catch {
      // ignore
    }
  }, [questMissions]);

  const updateProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
  };

  const toggleSaveScholarship = (id: string) => {
    setSavedScholarshipIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (next.length >= 3) {
        completeQuestMission('quest-save-three');
      }
      return next;
    });
  };

  const addDocument = (doc: Omit<UserDocument, 'id' | 'uploadDate'>) => {
    const newDoc: UserDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    setDocuments((prev) => [newDoc, ...prev]);
    completeQuestMission('quest-vault-ready');
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const updateApplicationStage = (scholarshipId: string, stage: JourneyStage) => {
    setApplicationTracks((prev) => {
      const existing = prev[scholarshipId] || {
        scholarshipId,
        stage: 'DISCOVER',
        checklist: [
          { id: '1', label: 'Review guidelines & eligibility', completed: true },
          { id: '2', label: 'Gather required documents', completed: false },
          { id: '3', label: 'Complete portal registration', completed: false },
          { id: '4', label: 'Submit verified application', completed: false },
        ],
      };
      return {
        ...prev,
        [scholarshipId]: {
          ...existing,
          stage,
          appliedDate: stage === 'APPLY' || stage === 'SUBMITTED' ? existing.appliedDate || new Date().toISOString().split('T')[0] : existing.appliedDate,
        },
      };
    });

    if (stage === 'APPLY' || stage === 'SUBMITTED') {
      completeQuestMission('quest-first-apply');
    }
  };

  const updateApplicationChecklist = (scholarshipId: string, checklistId: string, completed: boolean) => {
    setApplicationTracks((prev) => {
      const existing = prev[scholarshipId];
      if (!existing) return prev;
      return {
        ...prev,
        [scholarshipId]: {
          ...existing,
          checklist: existing.checklist.map((item) =>
            item.id === checklistId ? { ...item, completed } : item
          ),
        },
      };
    });
  };

  const updateApplicationNotes = (scholarshipId: string, notes: string) => {
    setApplicationTracks((prev) => {
      const existing = prev[scholarshipId];
      if (!existing) return prev;
      return {
        ...prev,
        [scholarshipId]: { ...existing, notes },
      };
    });
  };

  const completeQuestMission = (id: string) => {
    setQuestMissions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, completed: true } : q))
    );
  };

  const resetDemoData = () => {
    setProfile(DEFAULT_STUDENT_PROFILE);
    setDocuments(INITIAL_USER_DOCUMENTS);
    setSavedScholarshipIds(DEFAULT_STUDENT_PROFILE.savedScholarshipIds);
    setQuestMissions(INITIAL_QUEST_MISSIONS);
    setApplicationTracks({
      'sch-reliance-ug': {
        scholarshipId: 'sch-reliance-ug',
        stage: 'PREPARE',
        appliedDate: '2026-10-25',
        notes: 'Aptitude test scheduled. Uploaded bonafide certificate.',
        checklist: [
          { id: 'c1', label: 'College Bonafide attested', completed: true },
          { id: 'c2', label: 'Class 12th marksheet verified', completed: true },
          { id: 'c3', label: 'Online Aptitude prep completed', completed: false },
        ],
      },
    });
    localStorage.clear();
  };

  const totalQuestPoints = questMissions
    .filter((q) => q.completed)
    .reduce((sum, q) => sum + q.points, 0);

  const eligibleScholarshipsCount = scholarships.filter((s) => {
    const res = evaluateScholarshipMatch(s, profile, documents);
    return res.status === 'ELIGIBLE' || res.status === 'POTENTIALLY ELIGIBLE';
  }).length;

  return (
    <AppContext.Provider
      value={{
        tab,
        setTab,
        profile,
        updateProfile,
        scholarships,
        documents,
        addDocument,
        removeDocument,
        savedScholarshipIds,
        toggleSaveScholarship,
        applicationTracks,
        updateApplicationStage,
        updateApplicationChecklist,
        updateApplicationNotes,
        selectedScholarshipId,
        setSelectedScholarshipId,
        gapAnalyzerScholarshipId,
        setGapAnalyzerScholarshipId,
        questMissions,
        completeQuestMission,
        showOnboardingModal,
        setShowOnboardingModal,
        showAssistantDrawer,
        setShowAssistantDrawer,
        showQuestModal,
        setShowQuestModal,
        resetDemoData,
        totalQuestPoints,
        eligibleScholarshipsCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

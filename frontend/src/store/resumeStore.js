
const useResumeStore = create((set) => ({
  resumes: [],
  currentResume: null,
  analysis: null,
  addResume: (resume) => set((state) => ({ resumes: [...state.resumes, resume] })),
  setCurrentResume: (resume) => set({ currentResume: resume }),
  setAnalysis: (analysis) => set({ analysis }),
  clearAnalysis: () => set({ analysis: null }),
}));

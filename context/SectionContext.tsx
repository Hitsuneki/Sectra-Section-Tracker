import React, { createContext, useState, ReactNode } from 'react';

interface SectionContextType {
  sectionId: string | null;
  setSectionId: (id: string) => void;
}

export const SectionContext = createContext<SectionContextType | undefined>(undefined);

export const SectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sectionId, setSectionId] = useState<string | null>(null);

  return <SectionContext.Provider value={{ sectionId, setSectionId }}>{children}</SectionContext.Provider>;
};

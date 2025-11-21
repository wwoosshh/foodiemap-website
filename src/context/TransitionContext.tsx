import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TransitionData {
  element: HTMLElement | null;
  rect: DOMRect | null;
  type: 'card' | 'button' | null;
}

interface TransitionContextType {
  transitionData: TransitionData;
  setTransitionData: (data: TransitionData) => void;
  clearTransitionData: () => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const TransitionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transitionData, setTransitionDataState] = useState<TransitionData>({
    element: null,
    rect: null,
    type: null,
  });

  const setTransitionData = (data: TransitionData) => {
    setTransitionDataState(data);
  };

  const clearTransitionData = () => {
    setTransitionDataState({
      element: null,
      rect: null,
      type: null,
    });
  };

  return (
    <TransitionContext.Provider value={{ transitionData, setTransitionData, clearTransitionData }}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
};

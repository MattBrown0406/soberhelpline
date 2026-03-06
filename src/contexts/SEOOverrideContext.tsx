import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface SEOOverrideContextType {
  isOverridden: boolean;
  setOverridden: (value: boolean) => void;
}

const SEOOverrideContext = createContext<SEOOverrideContextType>({
  isOverridden: false,
  setOverridden: () => {},
});

export function SEOOverrideProvider({ children }: { children: ReactNode }) {
  const [isOverridden, setOverridden] = useState(false);
  return (
    <SEOOverrideContext.Provider value={{ isOverridden, setOverridden }}>
      {children}
    </SEOOverrideContext.Provider>
  );
}

export function useSEOOverride() {
  return useContext(SEOOverrideContext);
}

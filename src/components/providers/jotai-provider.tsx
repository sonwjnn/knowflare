"use client";

import { Provider } from "jotai";

type JotaiProviderProps = {
  children: React.ReactNode;
};

export const JotaiProvider = ({ children }: JotaiProviderProps) => {
  return <Provider>{children}</Provider>;
};

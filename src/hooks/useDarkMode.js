import { useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext";

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined)
    throw new Error("Dark Mode Context is used outside of its scope");
  return context;
}

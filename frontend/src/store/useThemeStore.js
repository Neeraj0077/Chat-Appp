import { create } from "zustand";

const storedTheme = localStorage.getItem("chat-theme") || "coffee";
 
document.documentElement.setAttribute("data-theme", storedTheme);

export const useThemeStore = create((set) => ({
  theme: storedTheme,
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);  
    set({ theme });
  },
}));
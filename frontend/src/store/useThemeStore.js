// import { create } from "zustand";

// export const useThemeStore = create((set) => ({
//   theme: localStorage.getItem("chat-theme") || "coffee",
//   setTheme: (theme) => {
//     localStorage.setItem("chat-theme", theme);
//     set({ theme });
//   },
// }));

import { create } from "zustand";

const storedTheme = localStorage.getItem("chat-theme") || "coffee";

// Apply on initial load before React renders
document.documentElement.setAttribute("data-theme", storedTheme);

export const useThemeStore = create((set) => ({
  theme: storedTheme,
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    document.documentElement.setAttribute("data-theme", theme); // apply instantly
    set({ theme });
  },
}));
import { createSignal, createEffect } from "solid-js";

export type Theme = "light" | "dark" | "aemeath";

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem("theme") as Theme;
  if (savedTheme && ["light", "dark", "aemeath"].includes(savedTheme)) {
    return savedTheme;
  }
  return "light"; // Default theme
};

const [theme, setTheme] = createSignal<Theme>(getInitialTheme());

createEffect(() => {
  const currentTheme = theme();
  document.body.setAttribute("data-theme", currentTheme);
  localStorage.setItem("theme", currentTheme);
});

export const useTheme = () => {
  const toggleTheme = () => {
    const current = theme();
    if (current === "light") setTheme("dark");
    else if (current === "dark") setTheme("aemeath");
    else setTheme("light");
  };

  const setSpecificTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return { theme, toggleTheme, setSpecificTheme };
};

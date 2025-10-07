// frontend/Shared/darkmode.ts
document.addEventListener("DOMContentLoaded", () => {
  const darkBtn = document.getElementById("darkModeBtn") as HTMLButtonElement | null;
  if (!darkBtn) return;

  const updateBtn = (isDark: boolean): void => {
    darkBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  };
  const savedTheme: string | null = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    updateBtn(true);
  } else {
    updateBtn(false);
  }

  // Toggle bij klik + keuze opslaan
  darkBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark: boolean = document.body.classList.contains("dark");
    updateBtn(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});

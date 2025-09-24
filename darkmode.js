const darkBtn = document.getElementById("darkModeBtn");

const savedThema = localStorage.getItem("thema");
if (savedThema === "dark") {
  document.body.classList.add("dark");
  darkBtn.textContent = "☀️ Light Mode";
}

// Event listener
darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  darkBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("thema", isDark ? "dark" : "light");
});

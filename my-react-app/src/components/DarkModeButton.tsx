// src/components/DarkModeButton.tsx
import { useEffect, useState } from "react";

type Theme = "Light" | "Dark";
const CSS_FILES = ["base.css", "topbar.css", "home.css", "login.css", "events.css"];

const hrefFor = (theme: Theme, file: string) =>
    new URL(`../styles/${theme}Styles/${file}`, import.meta.url).href;

function removeLegacyStyles() {
    const links = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'));
    links.forEach((l) => {
        const href = l.getAttribute("href") || "";
        const id = l.id || "";
        if (id.startsWith("theme-")) return;
        if (href.includes("/styles/") && !href.endsWith("darktoggle.css")) l.remove();
    });
}

export default function DarkModeButton() {
    const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

    useEffect(() => {
        removeLegacyStyles();
        const theme: Theme = dark ? "Dark" : "Light";
        CSS_FILES.forEach((file) => {
            const id = `theme-${file}`;
            let link = document.getElementById(id) as HTMLLinkElement | null;
            if (!link) {
                link = document.createElement("link");
                link.rel = "stylesheet";
                link.id = id;
                document.head.appendChild(link);
            }
            link.href = hrefFor(theme, file);
            document.head.appendChild(link);
        });
    }, [dark]);

    const toggle = () => {
        const next = !dark;
        setDark(next);
        localStorage.setItem("theme", next ? "dark" : "light");
    };

    return (
        <button id="darkModeBtn" onClick={toggle}>
            {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
    );
}

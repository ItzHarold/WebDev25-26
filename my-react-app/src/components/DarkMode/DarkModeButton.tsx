import { useEffect, useState } from "react";

type Theme = "Light" | "Dark";

const THEME_FILES: Record<Theme, string[]> = {
    Light: [
        "../pages/LightBase.css",
        "./Topbar/LightTopbar.css",
        "../pages/Home/LightHome.css",
        "../pages/Login/LightLogin.css",
        "../pages/Events/LightEvents.css",
        "../pages/Register/LightRegister.css",
        "../pages/About/LightAbout.css",
        "../pages/Contact/LightContact.css",
        "../pages/Profile/LightProfile.css",
    ],
    Dark: [
        "../pages/DarkBase.css",
        "./Topbar/DarkTopbar.css",
        "../pages/Home/DarkHome.css",
        "../pages/Login/DarkLogin.css",
        "../pages/Events/DarkEvents.css",
        "../pages/Register/DarkRegister.css",
        "../pages/About/DarkAbout.css",
        "../pages/Contact/DarkContact.css",
        "../pages/Profile/DarkProfile.css",
    ],
};

const STATIC_FILES = ["./DarkToggle.css"];

const urlFor = (p: string) => new URL(p, import.meta.url).href;

function ensureLink(id: string) {
    let el = document.getElementById(id) as HTMLLinkElement | null;
    if (!el) {
        el = document.createElement("link");
        el.rel = "stylesheet";
        el.id = id;
        document.head.appendChild(el);
    }
    return el;
}

function removeThemeLinks() {
    document
        .querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
        .forEach((l) => {
            if (l.id.startsWith("theme-")) l.remove();
        });
}

export default function DarkModeButton() {
    const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

    // load static once
    useEffect(() => {
        STATIC_FILES.forEach((p) => {
            const id = `static-${p.split("/").pop()}`;
            const link = ensureLink(id);
            link.href = urlFor(p);
        });
    }, []);

    // swap themed files
    useEffect(() => {
        removeThemeLinks();
        const theme: Theme = dark ? "Dark" : "Light";
        THEME_FILES[theme].forEach((p, i) => {
            const id = `theme-${i}-${p.split("/").pop()}`;
            const link = ensureLink(id);
            link.href = urlFor(p);
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

import { Routes, Route, Navigate } from "react-router-dom";
import TopBar from "./components/topbar";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import LoginPage from "./pages/LoginPage";
import DarkModeButton from "./components/DarkModeButton";

export default function App() {
    return (
        <>
            <TopBar />
            <Routes>
                <Route path="/" element={<Navigate to="/Login" replace />} />
                <Route path="/Login" element={<LoginPage />} />
                <Route path="/Home" element={<HomePage />} />
                <Route path="/Events" element={<EventsPage />} />
                <Route path="/Register" element={<div />} />
                <Route path="*" element={<Navigate to="/Login" replace />} />
            </Routes>
            <DarkModeButton />
        </>
    );
}

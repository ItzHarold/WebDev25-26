// ===============================================
// src/App.tsx
// ===============================================
import { Routes, Route, Navigate } from "react-router-dom";
import TopBar from "./components/Topbar/Topbar";
import HomePage from "./pages/Home/HomePage";
import EventDetailPage from "./pages/Events/EventDetailPage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import AboutPage from "./pages/About/AboutPage";
import ContactPage from "./pages/Contact/ContactPage";
import DarkModeButton from "./components/DarkMode/DarkModeButton";
import { AuthProvider } from "./context/AuthContext";
import { RequireRole } from "./components/guards";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ProfilePage from "./pages/Profile/ProfilePage";

export default function App() {
    return (
        <AuthProvider>
            <TopBar />
            <Routes>
                <Route path="/" element={<Navigate to="/Login" replace />} />

                {/* public */}
                <Route path="/Login" element={<LoginPage />} />
                <Route path="/Register" element={<RegisterPage />} />
                <Route path="/Home" element={<HomePage />} />
                <Route path="/Events/:id" element={<EventDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                
                
                {/* protected by role */}
                <Route
                    path="/dashboard"
                    element={
                        <RequireRole roles={["admin"]}>
                            <DashboardPage />
                        </RequireRole>
                    }
                />

                <Route path="*" element={<Navigate to="/Login" replace />} />
            </Routes>
            <DarkModeButton />
        </AuthProvider>
    );
}

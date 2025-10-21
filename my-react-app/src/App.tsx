import { Routes, Route, Navigate } from "react-router-dom";
import TopBar from "./components/topbar";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DarkModeButton from "./components/DarkModeButton";
import { AuthProvider } from "./context/AuthContext";
import { RequireAuth, RequireRole } from "./components/guards";

// Minimal role-target pages (placeholders to satisfy routing/components rule)
const AdminDashboard = () => <section className="card" style={{ maxWidth: 900, margin: "2rem auto" }}><h2>Admin Dashboard</h2></section>;
const ManageUsers    = () => <section className="card" style={{ maxWidth: 900, margin: "2rem auto" }}><h2>Manage Users</h2></section>;
const ManagerHome    = () => <section className="card" style={{ maxWidth: 900, margin: "2rem auto" }}><h2>Team Manager</h2></section>;
const ManagerEvents  = () => <section className="card" style={{ maxWidth: 900, margin: "2rem auto" }}><h2>Create / Manage Events</h2></section>;
const UserProfile    = () => <section className="card" style={{ maxWidth: 900, margin: "2rem auto" }}><h2>My Profile</h2></section>;

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
                <Route path="/Events" element={<EventsPage />} />

                {/* protected by role */}
                <Route
                    path="/admin"
                    element={
                        <RequireRole roles={["admin"]}>
                            <AdminDashboard />
                        </RequireRole>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <RequireRole roles={["admin"]}>
                            <ManageUsers />
                        </RequireRole>
                    }
                />
                <Route
                    path="/manager"
                    element={
                        <RequireRole roles={["manager"]}>
                            <ManagerHome />
                        </RequireRole>
                    }
                />
                <Route
                    path="/manager/events"
                    element={
                        <RequireRole roles={["manager"]}>
                            <ManagerEvents />
                        </RequireRole>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <RequireAuth>
                            <UserProfile />
                        </RequireAuth>
                    }
                />

                <Route path="*" element={<Navigate to="/Login" replace />} />
            </Routes>
            <DarkModeButton />
        </AuthProvider>
    );
}

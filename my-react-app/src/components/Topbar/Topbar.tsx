// ===============================================
// src/components/Topbar/TopBar.tsx
// ===============================================
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserMenu from "../UserMenu";

const TopBar: React.FC = () => {
	const { hasRole } = useAuth();

	return (
		<nav className="topbar" role="navigation">
			<div className="logo">
				<Link to="/Home" aria-label="Home">
					<img src="/trophy.svg" alt="Logo" />
				</Link>
			</div>

			<div className="nav-links">
				<Link to="/Home">Home</Link>
				{hasRole("admin") && <Link to="/dashboard">Dashboard</Link>}
			</div>

			<UserMenu />
		</nav>
	);
};

export default TopBar;

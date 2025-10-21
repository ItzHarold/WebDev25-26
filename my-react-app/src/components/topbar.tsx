import React from "react";
import { Link } from "react-router-dom";

const TopBar: React.FC = () => {
	return (
		<nav className="topbar" role="navigation">
			<div className="logo">
				<Link to="/Home">
					<img src="/trophy.svg" alt="ETM Trophy Logo"/>
				</Link>
			</div>

			<div className="nav-links">
				<Link to="/Home">Home</Link>
				<Link to="/dashboard">Dashboard</Link>
				<Link to="/about">About</Link>
				<Link to="/contact">Contact</Link>
			</div>

			<div className="auth-buttons">
				<Link to="/Login" className="auth-btn">Login</Link>
				<Link to="/Register" className="auth-btn">Register</Link>
			</div>
		</nav>
	);
};

export default TopBar;

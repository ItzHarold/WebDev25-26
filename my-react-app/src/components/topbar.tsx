import React from "react";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";
import logo from "../../public/trophy.svg";

const TopBar: React.FC = () => {
	return (
		<nav className="topbar" role="navigation">
			<div className="logo">
				<Link to="/Home" aria-label="Home">
					<img src={logo} alt="Logo" />
				</Link>
			</div>

			<div className="nav-links">
				<Link to="/Home">Home</Link>
				<Link to="/dashboard">Dashboard</Link>
			</div>

			<UserMenu />
		</nav>
	);
};

export default TopBar;

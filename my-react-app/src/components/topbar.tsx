import React from "react";
const TopBar: React.FC = () => {

	return (
		<>
			<nav className="topbar" role="navigation">
				<div className="logo">
					<a href="Home.html"><img src="../Pictures/defaulticon.jpg" alt="Logo"></img></a>
				</div>
				<div className="nav-links">
					<a href="../Home/Home.html">Home</a>
					<a href="../Dashboard/Dashboard.html">Dashboard</a>
					<a href="../About/About.html">About</a>
					<a href="../Contact/Contact.html">Contact</a>
				</div>
				<div className="welcome">Welcome USER</div>
			</nav>
		</>
	);
};
export default TopBar;
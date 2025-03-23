import React, { useState } from "react";
import "./Header.css";
import { BiMenuAltRight } from "react-icons/bi";
import { getMenuStyles } from "../../utils/common";
import useHeaderColor from "../../hooks/useHeaderColor";
import OutsideClickHandler from "react-outside-click-handler";
import { Link, NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import ProfileMenu from "../ProfileMenu/ProfileMenu";

const Header = () => {
	const [menuOpened, setMenuOpened] = useState(false);
	const headerColor = useHeaderColor();
	const { loginWithRedirect, isAuthenticated, logout } = useAuth0();
	const isAdmin = JSON.parse(localStorage.getItem("user"))?.isAdmin;
	const user = JSON.parse(localStorage.getItem("user"));

	return (
		<section className="h-wrapper" style={{ background: headerColor }}>
			<div className="flexCenter innerWidth paddings h-container">
				{/* logo */}
				<Link to="/">
					<img src="./logo.png" alt="logo" width={70} height={50} />
				</Link>

				{/* menu */}
				<OutsideClickHandler
					onOutsideClick={() => {
						setMenuOpened(false);
					}}
				>
					<div
						// ref={menuRef}
						className="flexCenter h-menu"
						style={getMenuStyles(menuOpened)}
					>
						<NavLink to="/">Home</NavLink>
						<NavLink to="/properties">Properties</NavLink>
						<NavLink to="/contactUs">Contact Us</NavLink>
						{/* <a href="mailto:zainkeepscode@gmail.com">Contact Us</a> */}

						{/* ADMIN DASHBOARD */}
						{isAuthenticated && isAdmin && (
							<NavLink to="/dashboard">Dashboard</NavLink>
						)}
						{/* login button */}
						{!isAuthenticated ? (
							<button className="button" onClick={() => loginWithRedirect()}>
								Login
							</button>
						) : (
							<ProfileMenu user={user} logout={logout} />
						)}
					</div>
				</OutsideClickHandler>

				{/* for medium and small screens */}
				<div
					className="menu-icon"
					onClick={() => setMenuOpened((prev) => !prev)}
				>
					<BiMenuAltRight size={30} />
				</div>
			</div>
		</section>
	);
};

export default Header;

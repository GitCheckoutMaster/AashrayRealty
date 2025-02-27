import React from "react";
import { Avatar, Menu } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const ProfileMenu = ({ user, logout }) => {
	const navigate = useNavigate();
	return (
		<Menu>
			<Menu.Target>
				<Avatar src={user?.image} alt="user image" radius={"xl"} />
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Item onClick={() => navigate("./favourites", { replace: true })}>
					Favourites
				</Menu.Item>

				<Menu.Item onClick={() => navigate("./bookings", { replace: true })}>
					Bookings
				</Menu.Item>

				<Menu.Item onClick={() => navigate("./profile", { replace: true })}>
					Edit Profile
				</Menu.Item>

				<Menu.Item
					onClick={() => {
						localStorage.clear();
						logout();
					}}
				>
					Logout
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
};

export default ProfileMenu;

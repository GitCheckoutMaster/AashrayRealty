import React, { useContext, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import UserDetailContext from "../../context/UserDetailContext";
import { useMutation } from "react-query";
import { createUser } from "../../utils/api";
import useFavourites from "../../hooks/useFavourites";
import useBookings from "../../hooks/useBookings";
import Social from "../Social/Social";

const Layout = () => {
	useFavourites();
	useBookings();

	const { isAuthenticated, user, getAccessTokenWithPopup } = useAuth0();
	const { setUserDetails } = useContext(UserDetailContext);

	const { mutate } = useMutation({
		mutationKey: [user?.email],
		mutationFn: (token) => createUser(user?.email, token),
	});

	useEffect(() => {
		const getTokenAndRegister = async () => {
			try {
				const res = await getAccessTokenWithPopup({
					authorizationParams: {
						audience: "http://localhost:8000",
						scope: "openid profile email",
					},
				});
				if (res) {
					localStorage.setItem("access_token", res);
					setUserDetails((prev) => ({ ...prev, token: res }));
					mutate(res);
				}
			} catch (e) {
				console.error(e);
			}
		};

		isAuthenticated && getTokenAndRegister();
	}, [isAuthenticated]);

	return (
		<>
			<div style={{ background: "var(--black)", overflow: "hidden" }}>
				<Header />
				<div
					style={{
						position: "fixed",
						top: "50%",
            transform: "translateY(-50%)",
						left: "0",
						width: "5%",
						zIndex: 1,
					}}
				>
					<Social />
				</div>

				{/* Outlet will be under Social */}
				<div style={{ position: "relative", zIndex: 0 }}>
					<Outlet />
				</div>
				{/* <Outlet /> */}
			</div>
			<Footer />
		</>
	);
};

export default Layout;

import React, { useState } from "react";
import { removeAdmin } from "../../utils/api";
import "./RemoveAdminStyle.css";

const RemoveAdmin = () => {
	const [email, setEmail] = useState("");

	const handleChange = (e) => {
		setEmail(e.target.value);
	};

	const handleClick = async () => {
		removeAdmin(email, localStorage.getItem("access_token"));
	};

	return (
		<div className="removeAdmin">
			<input type="text" placeholder="Enter email" onChange={handleChange} />
			<button className="button" onClick={handleClick}>Remove Admin</button>
		</div>
	);
};

export default RemoveAdmin;

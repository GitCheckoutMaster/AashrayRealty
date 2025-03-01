import { Outlet } from "react-router-dom";
import Dashboard from "../../pages/AdminDashboard/Dashboard";
import "./AdminLayoutStyle.css";

const AdminLayout = () => {
	return (
		<div className="admin-layout">
			<Dashboard />
			<main className="outlet">
				<Outlet />
			</main>
		</div>
	);
};

export default AdminLayout;

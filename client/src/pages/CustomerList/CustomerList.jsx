import { getCustomers, getEveryBooking } from "../../utils/api";
import "./CustomerListStyle.css";
import { useQuery } from "react-query";
import { useState } from "react";
import CustomerCard from "../../components/CustomerCard/CustomerCard";

const CustomerList = ({ admin }) => {
	const token = localStorage.getItem("access_token");
	const [customers, setCustomers] = useState([]);
	const { data, isLoading } = useQuery("bookings", () => {
		return getEveryBooking(localStorage.getItem("access_token"));
	},
		{
			onSuccess: (res) => {
				// console.log(res);
			},
		}
	)

	const response = useQuery("customers", () => getCustomers(token), {
		onSuccess: (res) => {
			setCustomers(res.data);
		},
	});
	if (response.isLoading || isLoading) {
		return <div>Loading...</div>;
	}

	console.log("data: ", data);

	return (
		<div className="customer-list-wrapper">
			<h1>{admin ? "Admin list" : "Customer List"}</h1>
			<div className="customer-list">
				{customers
					?.filter((customer) => {
						if (admin) return customer.isAdmin;
						// else return (!customer.isAdmin && data.userEmail != customer.email);
						// const hasBooking = data.some(booking => booking.userEmail === customer.email);
						return !customer.isAdmin;
					})
					.map((customer) => (
						<CustomerCard key={customer._id} customer={customer} />
					))}
			</div>
		</div>
	);
};

export default CustomerList;

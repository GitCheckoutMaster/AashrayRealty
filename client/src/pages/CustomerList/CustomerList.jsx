import { getCustomers } from "../../utils/api";
import "./CustomerListStyle.css";
import { useQuery } from "react-query";
import { useState } from "react";
import CustomerCard from "../../components/CustomerCard/CustomerCard";

const CustomerList = () => {
	const token = localStorage.getItem("access_token");
	const [customers, setCustomers] = useState([]);
	const response = useQuery("customers", () => getCustomers(token), {
		onSuccess: (res) => {
			setCustomers(res.data);
		},
	});
	if (response.isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="customer-list-wrapper">
			<h1>Customer List</h1>
			<div className="customer-list">
				{customers?.map((customer) => (
					<CustomerCard key={customer._id} customer={customer} />
				))}
			</div>
		</div>
	);
};

export default CustomerList;

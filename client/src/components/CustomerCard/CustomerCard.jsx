import "./CustomerCardStyle.css";

const CustomerCard = ({ customer }) => {
	const date = new Date(customer.createdAt);
	return (
		<div className={"customer-card" + (customer.isAdmin ? " admin" : "")}>
			<div className="customer-card-name">
				<img src={customer.image} alt={customer.name} />
        <div className="customer-card-name-details">
          <div className="id">#{customer.id.slice(0, 5)}...</div>
          <div className="name">
            {customer.name || customer.email.split("@")[0]}
          </div>
          <div className="date">
            Joined on{" "}
            {date.toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true, // Enables AM/PM format
            })}
          </div>
        </div>
			</div>
			<div className="customer-card-details">
				<div>Location</div>
				<div>{customer.address || "Not given"}</div>
			</div>
			<div className="customer-card-details">
				<div>Phone Number</div>
				<div>{customer.phoneNumber || "Not given"}</div>
			</div>
			<div className="customer-card-details">
				<div>Email</div>
				<div>{customer.email}</div>
			</div>
		</div>
	);
};

export default CustomerCard;

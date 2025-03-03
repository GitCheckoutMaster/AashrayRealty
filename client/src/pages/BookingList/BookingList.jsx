import { useQuery } from "react-query";
import { getEveryBooking, getProperty } from "../../utils/api";
import { useEffect, useState } from "react";
import "./BookingListStyle.css";

const BookingList = () => {
	const [property, setProperty] = useState([]);
	const { data, isLoading } = useQuery(
		"bookings",
		async () => {
			const response = getEveryBooking(localStorage.getItem("access_token"));
			return response;
		},
	);

  
  useEffect(() => {
		// console.log(property?.length, data?.length)
    if (property?.length === data?.length) {
      return;
    }
    data?.map(async (booking) => {
      const res = await getProperty(booking.residencyId);
      setProperty((prev) => {
				if (!prev.some((item) => item.id === res.id)) {
					return [...prev, res];
				}
				return prev;
			});
			
      console.log(property);
    });
  }, [data]);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
	return (
		<div className="booking-list">
			<h2>Booking List</h2>
			<div className="booking-list-content">
				<table>
					<thead>
						<tr>
							<th>Order ID</th>
							<th>Date</th>
							<th>Customer</th>
							<th>Property</th>
							<th>Location</th>
							<th>Price</th>
							<th>Type</th>
						</tr>
					</thead>
					<tbody>
						{data?.map((booking, index) => (
							<tr key={index}>
								<td>{booking.id.slice(0, 5)}...</td>
								<td>{new Date(booking.date).toLocaleDateString()}</td>
								<td>{booking.userEmail}</td>
								{property?.map((prop, index) => {
									if (prop.id === booking.residencyId) {
										return (
											<>
												<td>{prop.title}</td>
												<td>{prop.address}</td>
												<td>{prop.price}</td>
												<td>{prop.type}</td>
											</>
										);
									}
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default BookingList;

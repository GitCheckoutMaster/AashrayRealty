import React, { useEffect, useRef, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./Properties.css";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import SearchFilter from "../../components/SearchFilter/SearchFilter";
import { getEveryBooking } from "../../utils/api";
import { useQuery } from "react-query";

const Properties = () => {
	const { data, isError, isLoading } = useProperties();
	const [filteredData, setData] = useState(data);
	const [filter, setFilter] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);
	const [minBudget, setMinBudget] = useState(0);
	const [maxBudget, setMaxBudget] = useState(0);
	const [propertyType, setPropertyType] = useState("");
	const [type, setType] = useState("");
	const searchRef = useRef(null);
	const { data: bookings } = useQuery("bookings", () => getEveryBooking(localStorage.getItem("access_token")), {
		refetchOnWindowFocus: false,
		// onSuccess: (data) => {
		// 	console.log(data);
		// },
	});

	useEffect(() => {
		if (!data || !bookings) return;
	
		const filtered = data.filter((property) => {
			const booked = bookings.find(
				(booking) => booking.residencyId === property.id
			);
			return !booked;
		});
	
		setData(filtered);
	}, [bookings, data]); // Only need to run when bookings change
	
	

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (searchRef.current && !searchRef.current.contains(event.target)) {
				setShowDropdown(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	if (isError) {
		return (
			<div className="wrapper">
				<span>Error while fetching data</span>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="wrapper flexCenter" style={{ height: "60vh" }}>
				<PuffLoader
					height="80"
					width="80"
					radius={1}
					color="#4066ff"
					aria-label="puff-loading"
				/>
			</div>
		);
	}

	return (
		<div className="wrapper">
			<div className="flexColCenter paddings innerWidth properties-container">
				<div className="searchbar-container" ref={searchRef}>
					<SearchBar
						filter={filter}
						setFilter={setFilter}
						dropdown={true}
						setShowDropdown={setShowDropdown}
					/>
					{showDropdown && (
						<SearchFilter
							setOpened={setShowDropdown}
							setMinBudget={setMinBudget}
							setMaxBudget={setMaxBudget}
							setPropertyType={setPropertyType}
							setType={setType}
							minBudget={minBudget}
							maxBudget={maxBudget}
							propertyType={propertyType}
							type={type}
						/>
					)}
				</div>

				<div className="paddings flexCenter properties">
					{filteredData
						?.filter((property) => {
							const matchesSearch =
								property.title.toLowerCase().includes(filter.toLowerCase()) ||
								property.city.toLowerCase().includes(filter.toLowerCase()) ||
								property.country.toLowerCase().includes(filter.toLowerCase()) ||
								property.address.toLowerCase().includes(filter.toLowerCase());

							const available = property.Booking ? true : false;

							const matchesBudget =
								(minBudget === 0 || property.price >= minBudget) &&
								(maxBudget === 0 || property.price <= maxBudget);

							const matchesPropertyType =
								!propertyType || property.propertyType === propertyType;

							const matchesType = !type || property.type === type;

							return (
								matchesSearch &&
								matchesBudget &&
								matchesPropertyType &&
								matchesType &&
								!available
							);
						})
						.map((card, i) => (
							<PropertyCard card={card} key={i} />
						))}
				</div>
			</div>
		</div>
	);
};

export default Properties;

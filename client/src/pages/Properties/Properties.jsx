import React, { useEffect, useRef, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./Properties.css";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import SearchFilter from "../../components/SearchFilter/SearchFilter";

const Properties = () => {
	const { data, isError, isLoading } = useProperties();
	const [filter, setFilter] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);
	const [minBudget, setMinBudget] = useState(0);
	const [maxBudget, setMaxBudget] = useState(0);
	const [propertyType, setPropertyType] = useState("");
	const [type, setType] = useState("");
	const searchRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (searchRef.current && !searchRef.current.contains(event.target)) {
				setShowDropdown(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		console.log(minBudget, maxBudget, propertyType, type);
	}, [minBudget, maxBudget, propertyType, type]);

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
					{data
						.filter((property) => {
							const matchesSearch =
								property.title.toLowerCase().includes(filter.toLowerCase()) ||
								property.city.toLowerCase().includes(filter.toLowerCase()) ||
								property.country.toLowerCase().includes(filter.toLowerCase()) ||
								property.address.toLowerCase().includes(filter.toLowerCase());

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
								matchesType
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

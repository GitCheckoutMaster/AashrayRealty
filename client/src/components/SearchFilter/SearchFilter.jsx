import { useForm } from "react-hook-form";
import "./SearchFilterStyle.css";
import { Select } from "@mantine/core";

const SearchFilter = ({
	setOpened,
	setMinBudget,
	setMaxBudget,
	setPropertyType,
	setType,
  minBudget,
  maxBudget,
  propertyType,
  type,
}) => {
	const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      minBudget: minBudget,
      maxBudget: maxBudget,
      propertyType: propertyType,
      type: type,
    }
  });

	const handleFilter = async (data) => {
		setOpened(false);
    setMinBudget(parseInt(data.minBudget, 10));
    setMaxBudget(parseInt(data.maxBudget));
    setPropertyType(data.propertyType || "");
    setType(data.type || "");
	};

	return (
		<div className="search-filter" onMouseDown={(e) => e.stopPropagation()}>
			<form
				onSubmit={handleSubmit(handleFilter)}
				className="search-filter-form"
			>
				<div className="search-filter-type">
					<Select
						label="Property Type"
            defaultValue={propertyType}
						data={[
              { label: "Select", value: "" },
							{ label: "For Sale", value: "for sale" },
							{ label: "For Rent", value: "for rent" },
						]}
            onChange={(value) => setValue("propertyType", value)}
					/>
					<Select
						label="Type"
            defaultValue={type}
						data={[
              { label: "Select", value: "" },
							{ label: "Apartment", value: "apartment" },
							{ label: "Tenement", value: "tenement" },
							{ label: "Duplex", value: "duplex" },
							{ label: "Bungalow", value: "bungalow" },
							{ label: "Flat", value: "flat" },
							{ label: "Penthouse", value: "penthouse" },
							{ label: "Farmhouse", value: "farmhouse" },
						]}
            onChange={(value) => setValue("type", value)}
					/>
				</div>
				<div className="search-filter-budget">
					<span>Budget</span>
					<div style={{ display: "flex" }}>
						<input
							type="number"
							placeholder="Min Budget"
							{...register("minBudget")}
						/>
						<input
							type="number"
							placeholder="Max Budget"
							{...register("maxBudget")}
						/>
					</div>
				</div>
				<button type="submit" className="button">
					Filter
				</button>
			</form>
		</div>
	);
};

export default SearchFilter;

import { useQuery } from "react-query";
import "./DashboardMainStyle.css";
import { MdOutlineHouse } from "react-icons/md";
import { useMemo } from "react";
import {
	getEveryBooking,
	getAllProperties,
	getProperty,
} from "../../utils/api";
import { useEffect, useState } from "react";
import { AgCharts } from "ag-charts-react";
import { PuffLoader } from "react-spinners";
import { HiOutlineHomeModern } from "react-icons/hi2";
import "ag-charts-enterprise";


const DashboardMain = () => {
	const [properties, setProperties] = useState([]);
	const [bookedProperties , setBookedProperties] = useState([]);
	const [propertyLengths, setPropertyLengths] = useState([0, 0, 0, 0, 0]);
	const [sale, setSale] = useState(new Array(12).fill(0));
	const [rent, setRent] = useState(new Array(12).fill(0));

	const lineChartOptions = useMemo(
		() => ({
			data: Array.from({ length: 12 }, (_, i) => ({
				month: new Date(0, i).toLocaleString("default", { month: "short" }),
				sales: sale[i],
				rent: rent[i],
			})),
			padding: { top: 5, right: 5, bottom: 5, left: 5 },
			animation: {
				enabled: true,
				duration: 1000,
			},
			series: [
				{
					type: "line",
					xKey: "month",
					yKey: "sales",
					stroke: "#323ffa",
					strokeWidth: 4,
					marker: { enabled: false },
					interpolation: { type: "smooth" },
				},
				{
					type: "line",
					xKey: "month",
					yKey: "rent",
					stroke: "#57fa32",
					strokeWidth: 4,
					marker: { enabled: false },
					interpolation: { type: "smooth" },
				},
			],
		}),
		[sale, rent]
	);

	const res = useQuery("properties", getAllProperties, {
		onSuccess: (data) => {
			setProperties(data);
			let forSale = data.filter(
				(property) => property.propertyType === "for sale"
			).length;
			let forRent = data.filter(
				(property) => property.propertyType === "for rent"
			).length;
			let total = data.length;
			setPropertyLengths([
				forSale,
				forRent,
				total,
				(forSale / total) * 100,
				(forRent / total) * 100,
			]);
		},
	});

	const { data: allBookings, isLoading } = useQuery(
		"bookings",
		() => getEveryBooking(localStorage.getItem("access_token")),
	);	

	useEffect(() => {
		if (!allBookings || properties.length === 0) return;
	
		let saleLocal = new Array(12).fill(0);
		let rentLocal = new Array(12).fill(0);
	
		allBookings.forEach((booking) => {
			const date = new Date(booking.createdAt);
			const currentYear = new Date().getFullYear();
	
			if (currentYear === date.getFullYear()) {
				const propertyType = properties.find(
					(p) => p.id === booking.residencyId
				)?.propertyType;
	
				if (propertyType === "for sale") {
					saleLocal[date.getMonth()] += 1;
				} else if (propertyType === "for rent") {
					rentLocal[date.getMonth()] += 1;
				}
			}
		});
	
		setSale(saleLocal);
		setRent(rentLocal);
	}, [allBookings, properties]);


	if (res.isLoading) {
		return (
			<div className="loading">
				<PuffLoader color={"#FF6B6B"} loading={true} size={150} />
			</div>
		);
	}

	return (
		<div className="dashboard-main">
			<div className="total-properties">
				<MdOutlineHouse size={65} />
				<div className="total-properties-details">
					<h2>Total Properties</h2>
					<hr />
				</div>
				<div className="total-properties-number">{properties.length}</div>
			</div>
			<div className="total-properties-bottom-charts">
				<div className="total-properties-forSell">
					<div>
						{
							properties?.filter(
								(property) => property.propertyType === "for sale"
							)?.length
						}
						<br />
						<span style={{ fontWeight: 300, fontSize: "1.2rem" }}>
							Properties for sale
						</span>
					</div>
					<div className="chart">
						<AgCharts
							options={{
								data: [
									{ name: "for sale", amount: propertyLengths[0] },
									{ name: "", amount: propertyLengths[2] - propertyLengths[0] },
								],
								animation: {
									enabled: true,
									duration: 1000,
								},
								height: 100,
								width: 100,
								padding: { top: 5, right: 5, bottom: 5, left: 5 },
								series: [
									{
										cornerRadius: 2,
										type: "donut",
										angleKey: "amount",
										innerRadiusRatio: 0.6,
										fills: ["#3333ff", "#ede8e8"],
										strokes: ["#ffffff", "#ffffff"],
										showInLegend: false,
										innerLabels: [
											{
												text: propertyLengths[3].toFixed(0) + "%",
												fontSize: 15,
											},
										],
									},
								],
							}}
						/>
					</div>
				</div>
				<div className="total-properties-forRent">
					<div>
						{propertyLengths[1]}
						<br />
						<span style={{ fontWeight: 300, fontSize: "1.2rem" }}>
							Properties for rent
						</span>
					</div>
					<div className="chart">
						<AgCharts
							options={{
								data: [
									{ name: "For rent", amount: propertyLengths[1] },
									{ name: "", amount: propertyLengths[2] - propertyLengths[1] },
								],
								animation: {
									enabled: true,
									duration: 1000,
								},
								height: 100,
								width: 100,
								padding: { top: 5, right: 5, bottom: 5, left: 5 },
								series: [
									{
										type: "donut",
										cornerRadius: 2,
										calloutLabelKey: "name",
										angleKey: "amount",
										innerRadiusRatio: 0.6,
										fills: ["#4dff4d", "#ede8e8"],
										strokes: ["#ffffff", "#ffffff"],
										showInLegend: false,
										innerLabels: [
											{
												text: propertyLengths[4].toFixed(0) + "%",
												fontSize: 15,
											},
										],
									},
								],
								axes: [],
							}}
						/>
					</div>
				</div>
			</div>
			<div className="sales-overview">
				<h2 style={{ paddingBottom: "1rem" }}>Sales Overview</h2>
				<div className="sales-overview-icons">
					<div>
						<HiOutlineHomeModern
							size={50}
							style={{
								backgroundColor: "#323ffa",
								padding: "10px",
								borderRadius: "15px",
							}}
						/>
						<span>Total sale</span>
					</div>
					<div>
						<HiOutlineHomeModern
							size={50}
							style={{
								backgroundColor: "#57fa32",
								padding: "10px",
								borderRadius: "15px",
							}}
						/>
						<span>Total rent</span>
					</div>
				</div>
				<div className="overview-chart">
					<AgCharts options={lineChartOptions} />
				</div>
			</div>
		</div>
	);
};

export default DashboardMain;

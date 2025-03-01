import { useQuery } from "react-query";
import "./DashboardMainStyle.css";
import { MdOutlineHouse } from "react-icons/md";
import { getAllProperties } from "../../utils/api";
import { useState } from "react";
import { AgCharts } from "ag-charts-react";
import { PuffLoader } from "react-spinners";
import { HiOutlineHomeModern } from "react-icons/hi2";
import "ag-charts-enterprise";

const DashboardMain = () => {
	const [properties, setProperties] = useState([]);

	const res = useQuery("properties", getAllProperties, {
		onSuccess: (data) => {
			setProperties(data);
		},
	});

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
						2000
						<br />
						<span style={{ fontWeight: 300, fontSize: "1.2rem" }}>
							Properties for sale
						</span>
					</div>
					<div className="chart">
						<AgCharts
							options={{
								data: [
                  { name: "for sale", amount: 60 },
                  { name: "sold", amount: 40 },
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
										calloutLabelKey: "name",
										angleKey: "amount",
										innerRadiusRatio: 0.6,
										fills: ["#3333ff", "#ede8e8"],
										strokes: ["#ffffff", "#ffffff"],
										innerLabels: [
											{
												text: "60%",
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
						2000
						<br />
						<span style={{ fontWeight: 300, fontSize: "1.2rem" }}>
							Properties for rent
						</span>
					</div>
					<div className="chart">
						<AgCharts
							options={{
								data: [
									{ name: "For rent", amount: 50 },
									{ name: "Rented", amount: 30 },
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
												text: "63%",
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
            <HiOutlineHomeModern size={50} style={{backgroundColor: "#323ffa", padding: "10px", borderRadius: "15px"}}/>
            <span>Total sale</span>
          </div>
          <div>
            <HiOutlineHomeModern size={50} style={{backgroundColor: "#57fa32", padding: "10px", borderRadius: "15px"}} />
            <span>Total rent</span>
          </div>
        </div>
        <div className="overview-chart">
          <AgCharts
            options={{
              data: [
                { month: "Jan", sales: 2, rent: 2 },
                { month: "Feb", sales: 4, rent: 1 },
                { month: "Mar", sales: 1, rent: 4 },
                { month: "Apr", sales: 0, rent: 2 },
                { month: "May", sales: 4, rent: 6 },
                { month: "Jun", sales: 5, rent: 2 },
                { month: "Jul", sales: 2, rent: 1 },
                { month: "Aug", sales: 1, rent: 0 },
                { month: "Sep", sales: 6, rent: 2 },
                { month: "Oct", sales: 3, rent: 5 },
                { month: "Nov", sales: 3, rent: 3 },
                { month: "Dec", sales: 3, rent: 6 },
              ],
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
                  // fill: ["#ff3333"],
                  stroke: "#323ffa",
                  strokeWidth: 4,
                  marker: {
                    enabled: false,
                    // shape: "circle",
                    // size: 5,
                  },
                  interpolation: {
                    type: "smooth",
                  },
                },
                {
                  type: "line",
                  xKey: "month",
                  yKey: "rent",
                  // fill: ["#57fa32"],
                  stroke: "#57fa32",
                  strokeWidth: 4,
                  marker: {
                    enabled: false,
                    // shape: "circle",
                    // size: 5,
                  },
                  interpolation: {
                    type: "smooth",
                  },
                },
              ],
            }}
          />
        </div>
			</div>
		</div>
	);
};

export default DashboardMain;

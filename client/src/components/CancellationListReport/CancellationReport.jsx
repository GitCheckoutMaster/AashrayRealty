import { useState } from "react";
import { getProperty, getEveryCancellation } from "../../utils/api";
import { useQuery } from "react-query";
import { useEffect } from "react";
import "./CancellationReportStyle.css";
import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CancellationReport = () => {
	const { data, isLoading } = useQuery("cancellations", async () => {
		const response = getEveryCancellation(localStorage.getItem("access_token"));
		return response;
	});
	const [properties, setProperties] = useState([]);
	const printRef = React.useRef(null);

	useEffect(() => {
		if (properties?.length === data?.length) {
			return;
		}
		data?.map(async (cancellation) => {
			const res = await getProperty(cancellation.residencyId);
			setProperties((prev) => {
				if (prev && !prev.some((item) => item.id === res.id)) {
					return [...prev, res];
				}
				return prev;
			});
		});
	}, [data]);

	const handleDownloadPdf = async () => {
		const element = printRef.current;
		if (!element) {
			return;
		}

		const canvas = await html2canvas(element, {
			scale: 2,
		});
		const data = canvas.toDataURL("image/png");

		const pdf = new jsPDF({
			orientation: "portrait",
			unit: "px",
			format: "a4",
		});

		const imgProperties = pdf.getImageProperties(data);
		const pdfWidth = pdf.internal.pageSize.getWidth();

		const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

		pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
		pdf.save("bookingReport.pdf");
	};

	if (isLoading) {
		return <div>loading...</div>;
	}

	return (
		<div className="cancellation-report">
			<div className="container" ref={printRef}>
				<header className="header">
					<div className="right-header">
						<h2>Aashray Realty</h2>
						<p>
							1003 One World West, T-Junction,
							<br /> S.P. Ring Road, Near Ambli,
							<br />
							Ahmedabad-380058
							<br />
							<br />
						</p>
						<p>
							Date: <span id="currentDate"> {new Date().toLocaleDateString()} </span>
						</p>
					</div>
					<h1>Cancelling Report</h1>
				</header>

				<table className="table">
					<thead>
						<tr>
							<th>Cancellation ID</th>
							<th>Date</th>
							<th>Customer</th>
							<th>Property</th>
							<th>Location</th>
							<th>Price</th>
							<th>Type</th>
						</tr>
					</thead>
					<tbody>
						{data?.map((cancellation) => {
							return (
								<tr>
									<td>{cancellation.id.slice(0, 5)}...</td>
									<td>{new Date(cancellation.createdAt).toLocaleDateString()}</td>
									<td>{cancellation.userEmail}</td>
									{properties?.map((prop, index) => {
										if (prop.id === cancellation.residencyId) {
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
							);
						})}
					</tbody>
				</table>

				<script>
					document.getElementById("currentDate").innerText = new
					Date().toLocaleDateString();
				</script>
			</div>
			<button className="button" onClick={handleDownloadPdf}>
				Download PDF
			</button>
		</div>
	);
};

export default CancellationReport;
